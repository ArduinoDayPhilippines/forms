delete from public.merch_items;

insert into public.merch_items (name, tag, image, tone, price, sizes, sort_order)
values
  (
    'Arduino Swags Pack',
    'Includes: Mouse Pad Small (Black or White), Badge Pin, Magnet, Sticker',
    '/arduino_swags_pack/adph-swags.png',
    'from-amber-400/30 to-black/10',
    199,
    array['One Size'],
    10
  ),
  (
    'Arduino Starter Set',
    'Includes: Shirt, Badge Pin, Magnet, Sticker',
    '/arduino_starter_set/arduino-starter.png',
    'from-emerald-400/30 to-black/10',
    349,
    array['XS','S','M','L','XL','XXL'],
    20
  ),
  (
    'Arduino Gear Set',
    'Includes: Vest, Mouse Pad Small (Black or White), Badge Pin, Magnet, Sticker',
    '/arduino_gear_set/arduino-gear.png',
    'from-sky-500/35 to-black/10',
    499,
    array['XS','S','M','L','XL','XXL'],
    30
  ),
  (
    'Arduino Tech Set',
    'Includes: Mouse Pad Small (Black or White), Tote Bag, Mug, Badge Pin, Magnet, Sticker',
    '/arduino_tech_set/arduino-tech.png',
    'from-cyan-500/30 to-black/10',
    399,
    array['One Size'],
    40
  ),
  (
    'Arduino Maker Bundle',
    'Includes: Shirt, Mouse Pad Big, Badge Pin, Magnet, Sticker',
    '/arduino_maker_bundle/arduino-maker.png',
    'from-teal-500/30 to-black/10',
    599,
    array['XS','S','M','L','XL','XXL'],
    50
  ),
  (
    'Arduino Startup Bundle',
    'Includes: Vest, Cap, Tote Bag, Badge Pin, Magnet, Sticker',
    '/arduino_startup_bundle/arduino-startup.png',
    'from-orange-500/30 to-black/10',
    649,
    array['XS','S','M','L','XL','XXL'],
    60
  ),
  (
    'Arduino Creator Bundle',
    'Includes: Shirt, Mouse Pad Small (Black or White), Tote Bag, Mug, Badge Pin, Magnet, Sticker',
    '/arduino_creator_bundle/arduino-creator.png',
    'from-indigo-500/30 to-black/10',
    699,
    array['XS','S','M','L','XL','XXL'],
    70
  ),
  (
    'Arduino Core Kit',
    'Includes: Shirt, Cap, Mouse Pad Big, Tote Bag, Mug, Badge Pin, Magnet, Sticker',
    '/arduino_core_kit/arduino-core.png',
    'from-slate-800/40 to-black/10',
    899,
    array['XS','S','M','L','XL','XXL'],
    80
  ),
  (
    'Arduino Pro Builder Kit',
    'Includes: Shirt, Vest, Mouse Pad Big, Tote Bag, Mug, Badge Pin, Magnet, Sticker',
    '/arduino_pro_builder_kit/arduino-pro.png',
    'from-zinc-700/40 to-black/10',
    1149,
    array['XS','S','M','L','XL','XXL'],
    90
  ),
  (
    'Arduino Ultimate 2026 Kit',
    'Includes: Shirt, Vest, Cap, Mouse Pad Big, Mouse Pad Small (Black or White), Tote Bag, Mug, Badge Pin, Magnet, Sticker',
    '/arduino_ultimate_2026_kit/arduino-ultimate.png',
    'from-rose-500/30 to-black/10',
    1399,
    array['XS','S','M','L','XL','XXL'],
    100
  ),
  (
    'Shirt',
    'Individual Item',
    '/shirts/adph-shirt-variant1.png',
    'from-slate-900/45 to-black/10',
    300,
    array['S','M','L','XL'],
    110
  ),
  (
    'Vest',
    'Individual Item',
    '/vest/adph-vest-variant1.png',
    'from-slate-800/40 to-black/10',
    350,
    array['M','L','XL'],
    120
  ),
  (
    'Cap',
    'Individual Item',
    '/cap/adph-cap.png',
    'from-amber-400/30 to-black/10',
    150,
    array['One Size'],
    130
  ),
  (
    'Mouse Pad Big',
    'Individual Item',
    '/mouse_pad/adph-mouse-pad-big.png',
    'from-teal-500/30 to-black/10',
    300,
    array['One Size'],
    140
  ),
  (
    'Mouse Pad Small (Black)',
    'Individual Item',
    '/mouse_pad/adph-mouse-pad-small.png',
    'from-cyan-500/30 to-black/10',
    130,
    array['One Size'],
    151
  ),
  (
    'Mouse Pad Small (White)',
    'Individual Item',
    '/mouse_pad/adph-mouse-pad-small.png',
    'from-cyan-500/30 to-black/10',
    130,
    array['One Size'],
    152
  ),
  (
    'Tote Bag',
    'Individual Item',
    '/tote_bag/adph-tote-bag.png',
    'from-emerald-400/30 to-black/10',
    150,
    array['One Size'],
    160
  ),
  (
    'Mug',
    'Individual Item',
    '/mug/adph-mug.png',
    'from-amber-200/35 to-transparent',
    100,
    array['One Size'],
    170
  ),
  (
    'Badge Pin',
    'Individual Item',
    '/pins-and-magnets/adph-pins-and-magnets.png',
    'from-rose-400/30 to-black/10',
    30,
    array['One Size'],
    180
  ),
  (
    'Magnet',
    'Individual Item',
    '/pins-and-magnets/adph-pins-and-magnets.png',
    'from-indigo-500/30 to-black/10',
    40,
    array['One Size'],
    190
  ),
  (
    'Sticker',
    'Individual Item',
    '/stickers/adph-stickers.png',
    'from-slate-700/35 to-black/10',
    10,
    array['One Size'],
    200
  );
