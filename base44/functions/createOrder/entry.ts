import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const MAX_ITEMS = 20;
const CUSTOM_ID = 'custom-request';

function normalizePhone(input) {
  const raw = String(input || '').replace(/[\s\-().]/g, '');
  if (!raw) return '';
  if (raw.startsWith('+213')) return `0${raw.slice(4)}`;
  if (raw.startsWith('00213')) return `0${raw.slice(5)}`;
  if (raw.startsWith('213') && raw.length >= 11) return `0${raw.slice(3)}`;
  return raw;
}

function fail(message, status = 400) {
  return Response.json({ error: message }, { status });
}

function clean(value, max) {
  return String(value == null ? '' : value).trim().slice(0, max);
}

function reference() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const tail = Math.floor(1000 + Math.random() * 9000);
  return `NORA-${stamp}-${tail}`;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const db = base44.asServiceRole.entities;

    const submissionId = clean(body.submission_id, 80);
    if (!submissionId) return fail('Missing submission identifier.');

    const existing = await db.Order.filter({ submission_id: submissionId }, { limit: 1 });
    const existingList = Array.isArray(existing) ? existing : existing?.items || [];
    if (existingList.length > 0) return Response.json({ order: existingList[0], duplicate: true });

    const customer = body.customer || {};
    const name = clean(customer.full_name, 120);
    const phone = normalizePhone(customer.phone);
    const wilayaCode = clean(customer.wilaya_code, 2);
    const commune = clean(customer.commune, 120);
    const address = clean(customer.delivery_address, 400);
    const instructions = clean(customer.delivery_instructions, 600);

    if (name.length < 2) return fail('Please enter your full name.');
    if (!/^0[5-7]\d{8}$/.test(phone)) return fail('Please enter a valid Algerian phone number.');
    if (!/^\d{2}$/.test(wilayaCode)) return fail('Please select your wilaya.');
    if (commune.length < 2) return fail('Please enter your commune.');
    if (address.length < 5) return fail('Please enter your full delivery address.');

    const rawItems = Array.isArray(body.items) ? body.items : [];
    if (rawItems.length === 0) return fail('Your basket is empty.');
    if (rawItems.length > MAX_ITEMS) return fail('Too many different sets in one order. Please contact us.');

    const settingsRows = await db.StoreSettings.list('-created_date', 1);
    const settingsList = Array.isArray(settingsRows) ? settingsRows : settingsRows?.items || [];
    const settings = settingsList[0] || {};

    const deliveryRows = await db.DeliverySetting.filter({ wilaya_code: wilayaCode }, { limit: 1 });
    const deliveryList = Array.isArray(deliveryRows) ? deliveryRows : deliveryRows?.items || [];
    const delivery = deliveryList[0] || null;
    if (!delivery) return fail('Delivery to the selected wilaya is not configured yet. Please contact us.');
    if (delivery.is_available === false) return fail('Delivery to this wilaya is currently unavailable.');

    const productIds = [...new Set(rawItems.filter((item) => item && item.product_id !== CUSTOM_ID).map((item) => String(item.product_id)))];
    let products = [];
    if (productIds.length > 0) {
      const rows = await db.Product.filter({ id: { $in: productIds } }, { limit: 50 });
      products = Array.isArray(rows) ? rows : rows?.items || [];
    }
    const productMap = new Map(products.map((p) => [p.id, p]));

    const items = [];
    let subtotal = 0;

    for (const raw of rawItems) {
      const quantity = Math.min(99, Math.max(1, Math.floor(Number(raw?.quantity) || 1)));
      const shape = clean(raw?.shape, 40);
      const size = clean(raw?.size, 40);
      const sizeNote = clean(raw?.size_note, 300);
      const customization = clean(raw?.customization, 600);

      if (raw?.product_id === CUSTOM_ID) {
        if (customization.length < 5) return fail('Please describe your custom request.');
        items.push({
          product_id: CUSTOM_ID,
          product_name: 'Custom set request',
          product_slug: '',
          image: '',
          unit_price: 0,
          quantity,
          shape,
          size,
          size_note: sizeNote,
          customization,
          line_total: 0,
          price_on_request: true,
        });
        continue;
      }

      const product = productMap.get(String(raw?.product_id));
      if (!product) return fail('One of the sets in your basket is no longer available. Please review your basket.');
      if (product.is_available === false) return fail(`${product.name} is currently unavailable.`);

      const allowedShapes = Array.isArray(product.shapes) ? product.shapes : [];
      if (allowedShapes.length > 0 && shape && !allowedShapes.includes(shape)) {
        return fail(`The shape selected for ${product.name} is not available.`);
      }
      const allowedSizes = Array.isArray(product.sizes) ? product.sizes : [];
      if (allowedSizes.length > 0 && size && !allowedSizes.includes(size)) {
        return fail(`The size selected for ${product.name} is not available.`);
      }

      const unitPrice = Math.max(0, Number(product.price) || 0);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      items.push({
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug || '',
        image: (product.images && product.images[0]) || '',
        unit_price: unitPrice,
        quantity,
        shape,
        size,
        size_note: sizeNote,
        customization,
        line_total: lineTotal,
        price_on_request: false,
      });
    }

    let deliveryFee = null;
    if (subtotal > 0) {
      if (settings.free_delivery_threshold && subtotal >= Number(settings.free_delivery_threshold)) {
        deliveryFee = 0;
      } else if (Number.isFinite(Number(delivery.delivery_fee)) && delivery.delivery_fee !== null && delivery.delivery_fee !== undefined) {
        deliveryFee = Number(delivery.delivery_fee);
      } else if (Number.isFinite(Number(settings.default_delivery_fee)) && settings.default_delivery_fee) {
        deliveryFee = Number(settings.default_delivery_fee);
      }
    }

    const total = subtotal + (deliveryFee ?? 0);

    const order = await db.Order.create({
      order_reference: reference(),
      submission_id: submissionId,
      customer_name: name,
      phone,
      wilaya_code: wilayaCode,
      wilaya_name: delivery.wilaya_name,
      commune,
      delivery_address: address,
      delivery_instructions: instructions,
      items,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      status: 'New Order',
      internal_notes: '',
    });

    return Response.json({ order });
  } catch (error) {
    return Response.json({ error: error.message || 'Order could not be saved.' }, { status: 500 });
  }
}