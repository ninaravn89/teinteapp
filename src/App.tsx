import { useState, useRef, useCallback, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const UNDERTONE_DATA = {
  cool: {
    label:"Cool", color:"#9b8ec4", swatch:"#c4b8e0",
    vein:"Blue or purple", cast:"Pink, rosy, or bluish", jewelry:"Silver",
    description:"Your skin has a pink or rosy base. Veins appear distinctly blue or purple under natural light. Silver jewelry tends to look more harmonious than gold on your skin.",
    sun:"You tend to burn before you tan — your skin is more sensitive to UV.",
    avoid:"Anything labeled 'warm', 'golden', 'honey', or 'peachy' — these pull orange against your cool base and create an unnatural mask effect."
  },
  neutral: {
    label:"Neutral", color:"#b89b72", swatch:"#d4c4a8",
    vein:"Blue-green mix", cast:"Balanced — no strong pink or yellow", jewelry:"Both gold and silver",
    description:"Your skin sits between warm and cool. Veins appear to be a mix of blue and green. You can wear both gold and silver jewelry without either looking off.",
    sun:"You tan moderately well and don't burn as easily as cool-toned skin.",
    avoid:"Extreme warm or extreme cool shades — both can look slightly disconnected. Stick to 'N' or neutral-labeled shades."
  },
  warm: {
    label:"Warm", color:"#c47d3a", swatch:"#d4a96a",
    vein:"Greenish", cast:"Golden, peachy, or yellow", jewelry:"Gold",
    description:"Your skin has a golden, peachy, or yellow base. Veins appear clearly greenish in natural light. Gold jewelry enhances your natural glow beautifully.",
    sun:"You tend to tan easily and golden — your skin builds melanin efficiently.",
    avoid:"Anything pink-toned, ashy, or labeled 'cool' — these cancel out your warmth and make skin look grey or washed out."
  }
};

const FOUNDATION_DATA = {
  cool: {
    depth_ranges: {
      fair:   { range:"15C–17C", keywords:["Fair Porcelain","Cool Porcelain","Rosy Ivory"], reason:"The 'C' code locks in cool undertone. At fair depth, Porcelain is your starting point — it's the lightest cool shade most brands carry." },
      light:  { range:"21C", keywords:["Cool Ivory","Light Porcelain","Blush Beige"], reason:"One step up from fair, cool-coded. 'Cool Ivory' or 'Blush Beige' read pink-neutral on your skin without going orange." },
      medium: { range:"27C–29C", keywords:["Cool Beige","Taupe Beige","Rose Beige"], reason:"Medium cool shades often have the word 'Taupe' or 'Rose' — these are your signals. They add depth without warmth." },
      deep:   { range:"33C–37C", keywords:["Cool Mahogany","Hazel","Mocha Cool"], reason:"Deep cool shades are harder to find — look specifically for 'C' coded or 'cool' labeled shades in deeper ranges." }
    },
    brands: {
      luxury:["TIRTIR 15C Fair Porcelain","NARS Deauville","Charlotte Tilbury 1 Fair Cool","Armani Luminous Silk 1.5"],
      mid:["MAC Studio Fix NC10","L'Oreal True Match C1 Rose Ivory","Maybelline Fit Me 110 Porcelain"],
      drugstore:["e.l.f. Halo Glow in Fair Cool","NYX Total Control Drop in Porcelain","Wet n Wild Photo Focus in Ivory"]
    },
    pro_tip:"TIRTIR and Korean beauty brands are excellent for cool fair skin — they're designed with cool undertones in mind and have the lightest cool shade ranges on the market.",
    brush_tip:"Use a damp beauty sponge for natural coverage or a flat foundation brush for full coverage. Stipple (don't swipe) to avoid streaks.",
    brush_icon:"🪄"
  },
  neutral: {
    depth_ranges: {
      fair:   { range:"13N–17N", keywords:["Fair Ivory","Vanilla","Nude Ivory"], reason:"Neutral fair shades are labeled 'N' and often called 'Vanilla' or 'Ivory' — neither pink nor yellow, just balanced." },
      light:  { range:"21N", keywords:["Ivory","Shell Beige","Natural Beige"], reason:"The classic light neutral. Most brands' 'Ivory' or 'Natural' shade sits here — it's the most widely stocked." },
      medium: { range:"23N–25N", keywords:["Sand","Latte","Natural Beige"], reason:"Sand and Latte are classic neutral mediums — warm enough to look alive, cool enough not to look orange." },
      deep:   { range:"33N–40N", keywords:["Macchiato","Walnut","Pecan","Rich Brown"], reason:"Neutral deep shades give you depth without pulling ashy or brassy — look for 'N' coded shades." }
    },
    brands: {
      luxury:["TIRTIR 13N Fair Ivory","Fenty Pro Filt'r 185N","Estee Lauder Double Wear 2W1 Dawn","NARS Natural Radiant Deauville"],
      mid:["MAC Studio Fix NC20","L'Oreal True Match N3","Maybelline Fit Me 220 Natural Beige"],
      drugstore:["Revlon ColorStay 150 Buff","CoverGirl TruBlend W2","NYX Total Control Drop in Vanilla"]
    },
    pro_tip:"Neutral is the most flexible undertone. If you can't find your exact shade, you can blend a cool and warm shade 50/50 and get a perfect neutral match.",
    brush_tip:"A damp sponge gives the most seamless finish for neutral skin. Buffing brush works great too — blend in circular motions from the center outward.",
    brush_icon:"🪄"
  },
  warm: {
    depth_ranges: {
      fair:   { range:"13W–17W", keywords:["Cream","French Vanilla","Warm Ivory"], reason:"Warm fair shades pull slightly golden or peachy — 'French Vanilla' and 'Cream' are the classic names to look for." },
      light:  { range:"21W", keywords:["Natural Ivory","Warm Beige","Golden Ivory"], reason:"Light warm is often called 'Natural Ivory' or 'Golden' — it has a subtle peachy-golden cast that enhances your skin's warmth." },
      medium: { range:"24W–27W", keywords:["Soft Beige","Golden Beige","Honey","Caramel"], reason:"Honey and Golden Beige are your keywords. These add the warmth your skin already has, creating a seamless match." },
      deep:   { range:"33W–45W", keywords:["Ginger","Toffee","Golden Mahogany","Bronze"], reason:"Warm deep shades lean golden-bronze. Avoid anything 'ashy' — it will look flat and grey against your warm deep skin." }
    },
    brands: {
      luxury:["TIRTIR 17W French Vanilla","Fenty Pro Filt'r 230W","Charlotte Tilbury 3 Warm","Giorgio Armani Luminous Silk 4.5"],
      mid:["MAC Studio Fix NW20","L'Oreal True Match W2 Golden Beige","Maybelline Fit Me 230 Natural Buff"],
      drugstore:["Revlon ColorStay 220 Natural Beige","L'Oreal Infallible 24H W2","e.l.f. Flawless Finish in Sand"]
    },
    pro_tip:"Warm-toned skin oxidizes foundations slightly more — buy a shade that looks slightly lighter than your skin in-store. After 30 minutes it deepens to a perfect match.",
    brush_tip:"A flat kabuki brush or damp sponge works best. Warm skin benefits from pressing product in rather than sweeping — it prevents the foundation from oxidizing unevenly.",
    brush_icon:"🪄"
  }
};

const CONCEALER_DATA = {
  cool: {
    purpose_map: [
      { concern:"Dark circles / under eye", shade:"Peach-pink corrector, then your foundation shade", hex:"#e8b4a0", why:"Dark under-eyes on cool skin often have a blue-purple tint. A peach-pink corrector neutralizes that purple before you apply concealer. Without it, you're just layering grey over purple.", products:["NARS Radiant Creamy Concealer in Chantilly","Charlotte Tilbury Magic Away in 1 Fair","e.l.f. Halo Glow Liquid Filter"] },
      { concern:"Blemishes / redness", shade:"Exact foundation match or 1 shade lighter", hex:"#d4c0c0", why:"Blemishes on cool skin are red. Use your exact foundation shade as concealer — going too light makes blemishes glow under light.", products:["TIRTIR concealer in 15C","MAC Studio Fix Fluid NC10","Maybelline Instant Age Rewind in Fair"] },
      { concern:"Brightening / highlighting", shade:"1–2 shades lighter, cool-toned", hex:"#f0e8e8", why:"To brighten (nose bridge, cupid's bow, inner corners), you need a cool-toned lighter shade. A warm highlighter concealer looks yellow and patchy against cool skin.", products:["NARS Radiant in Vanilla","Too Faced Born This Way in Snow","Fenty Pro Filt'r in W05"] },
      { concern:"Hyperpigmentation / dark spots", shade:"Orange or peach corrector, then concealer match", hex:"#e8a080", why:"Dark spots need a color corrector opposite on the color wheel. On cool skin use a lighter peach corrector — too orange will show through.", products:["NYX Color Correcting Palette (peach)","Dermablend Quick Fix Full Coverage","Catrice Camouflage Cream"] }
    ],
    pro_tip:"Never use a warm or yellow concealer under cool-toned eyes — it creates a muddy brown-orange cast instead of brightness.",
    brush_tip:"Use a small flat concealer brush for blemishes (precise). For under-eye, pat with your ring finger or a damp sponge — never rub.",
    brush_icon:"🖌️"
  },
  neutral: {
    purpose_map: [
      { concern:"Dark circles / under eye", shade:"Peach or salmon corrector, then neutral concealer", hex:"#e8b090", why:"Neutral skin can have blue-purple or brown-toned circles. A light peach corrector handles both. Follow with a neutral concealer that matches your skin exactly.", products:["Fenty Pro Filt'r Instant Retouch in 185N","NARS Radiant Creamy Concealer in Vanilla","L'Oreal True Match in W1-2-3"] },
      { concern:"Blemishes / redness", shade:"Exact match to foundation", hex:"#d4bca0", why:"Neutral skin is forgiving — your exact foundation shade as a spot concealer blends seamlessly. You can go 0.5 shades lighter without it looking obviously placed.", products:["Maybelline Fit Me Concealer in 20 Sand","MAC Studio Fix NC20 concealer","e.l.f. 16HR Camo Concealer in Light Sand"] },
      { concern:"Brightening / highlighting", shade:"1–2 shades lighter, neutral-warm", hex:"#f0e8d8", why:"A neutral-warm lighter shade brightens naturally. Since you're neutral, you can go slightly warm or cool here without clashing.", products:["Charlotte Tilbury Magic Away 2 Neutral","NARS Radiant in Custard","Rare Beauty Liquid Touch in 110N"] },
      { concern:"Hyperpigmentation / dark spots", shade:"Peach-orange corrector, then exact match", hex:"#e09870", why:"Neutral skin handles a slightly more saturated peach-orange corrector. It cancels pigment cleanly before you layer your concealer on top.", products:["NYX Concealer Wand in Natural","Dermablend Smooth Liquid Camo","IT Cosmetics Bye Bye Under Eye in 10N"] }
    ],
    pro_tip:"Neutral skin has the most concealer flexibility. One shade lighter for under-eye, exact shade for blemishes — both work perfectly.",
    brush_tip:"A small concealer brush for blemishes, a damp sponge for under-eye. Tap, don't rub — rubbing lifts the product and breaks coverage.",
    brush_icon:"🖌️"
  },
  warm: {
    purpose_map: [
      { concern:"Dark circles / under eye", shade:"Orange or deep peach corrector, then warm concealer", hex:"#e89060", why:"Warm skin often has brown or olive-tinted circles. An orange corrector neutralizes the brown pigment perfectly. Then layer a warm-coded concealer over it.", products:["NYX Orange Color Corrector","Fenty Pro Filt'r 370W","NARS Radiant Creamy in Ginger"] },
      { concern:"Blemishes / redness", shade:"Exact warm foundation shade", hex:"#d4a878", why:"On warm skin, a cool-toned concealer on a blemish looks like a grey patch. Always match your warm foundation. The golden undertone blends warm concealer invisibly.", products:["TIRTIR 17W concealer","Fenty Pro Filt'r 230W","Maybelline Fit Me 240 Golden Beige"] },
      { concern:"Brightening / highlighting", shade:"1–2 shades lighter, warm-golden tone", hex:"#f0e0c0", why:"Brightening on warm skin works best with a golden-peachy lighter shade. A cool white-toned brightener will look ashy and disconnected.", products:["Charlotte Tilbury Magic Away 3 Warm","NARS Radiant in Honey","Too Faced Born This Way in Warm Beige"] },
      { concern:"Hyperpigmentation / dark spots", shade:"Deep orange or brick corrector, then warm concealer", hex:"#c07040", why:"Warm deeper skin often has more concentrated hyperpigmentation. A more saturated orange-brick corrector is needed to fully cancel it.", products:["Dermablend Quick Fix Corrector in Orange","Black Opal True Color Corrector","e.l.f. Putty Primer (works as corrector)"] }
    ],
    pro_tip:"Always set under-eye concealer with a warm-toned banana (yellow-tinted) powder. A stark white setting powder cancels your natural warmth and looks chalky.",
    brush_tip:"Use a fan brush to lightly dust setting powder over warm-toned concealer. A flat brush presses too hard and can lift the product.",
    brush_icon:"🖌️"
  }
};

const BLUSH_EDU = [
  { color:"Pink / Baby Pink", hex:"#f4a7b9", effect:"Fresh, youthful, romantic flush", skin_types:"Best on fair to light cool or neutral skin", why:"Pink blush mimics the natural flush of rosy, fair skin. On deeper or warm skin, pink can look ashy or disconnected from the skin's base.", works_for:["cool","neutral"], avoid_on:"Warm or deep skin — pulls grey or artificially bright" },
  { color:"Mauve / Berry", hex:"#c06080", effect:"Sophisticated, editorial, moody depth", skin_types:"Best on cool or neutral skin at any depth", why:"Mauve and berry tones harmonize with the blue-pink undertones in cool skin. On deep cool or neutral skin they create incredible dimension. On warm skin they look flat or bruised.", works_for:["cool","neutral"], avoid_on:"Warm-toned skin — fights the golden undertone" },
  { color:"Peach / Apricot", hex:"#f4a070", effect:"Soft, sun-kissed, approachable warmth", skin_types:"Best on neutral or warm fair to medium skin", why:"Peach blush has warm golden-pink pigments. On neutral or warm skin it creates a believable flush. On cool skin it can clash — the warm orange base fights the skin's pink base.", works_for:["neutral","warm"], avoid_on:"Cool-toned skin — looks orange or muddy" },
  { color:"Coral", hex:"#f06848", effect:"Bold, vibrant, tropical energy", skin_types:"Best on warm or neutral medium to deep skin", why:"Coral is high-saturation and warm. It pops beautifully on warm medium and deep skin. On fair or cool skin it can overwhelm — it needs melanin to anchor it.", works_for:["warm","neutral"], avoid_on:"Fair or cool skin — too vivid without enough melanin" },
  { color:"Terracotta / Brick", hex:"#c05838", effect:"Earthy, warm, editorial glow", skin_types:"Best on warm medium to deep skin", why:"Terracotta and brick tones are deeply warm and earthy. On warm medium and deep skin they look like a natural sun-warmed flush. On cool or fair skin they look dirty.", works_for:["warm"], avoid_on:"Cool skin or fair skin — appears muddy or unnatural" },
  { color:"Dusty Rose / Muted Pink", hex:"#c89090", effect:"Soft, romantic, vintage elegance", skin_types:"Best on neutral or cool light to medium skin", why:"Dusty rose is muted pink with grey or purple tones that work beautifully on cool and neutral skin. On warm skin the grey-purple cast looks off.", works_for:["cool","neutral"], avoid_on:"Warm skin — the muted quality clashes with warm golden bases" },
  { color:"Nude / Warm Brown", hex:"#c0906a", effect:"Natural, no-makeup glow, subtle definition", skin_types:"Best on warm or neutral medium to deep skin", why:"Nude blushes add warmth and dimension without obvious color. On deep warm skin they create a natural-looking flush. On fair or cool skin they disappear or pull muddy.", works_for:["warm","neutral"], avoid_on:"Fair or cool skin — turns muddy or disappears entirely" },
  { color:"Golden / Shimmer Bronze", hex:"#c89840", effect:"Luminous, sun-kissed, glowy finish", skin_types:"Best on warm or neutral medium to deep skin", why:"Golden and bronze blushes amplify warmth and glow. On warm skin they're spectacular. On cool skin the yellow-gold pigment fights the rosy base and looks unnatural.", works_for:["warm","neutral"], avoid_on:"Cool-toned skin — yellow gold clashes with pink skin base" }
];

const BLUSH_RECS = {
  cool: {
    fair:{top:["Baby Pink","Dusty Rose","Soft Mauve"],why:"Fair cool skin has very little melanin — lighter pinks and dusty roses sit naturally without overwhelming."},
    light:{top:["Mauve","Berry Pink","Dusty Rose"],why:"Light cool skin handles slightly deeper pinks. Berry and mauve look incredibly sophisticated and dimensional."},
    medium:{top:["Berry","Deep Mauve","Cool Rose"],why:"Medium cool skin pops with berry and deep mauve — these shades look editorial and rich."},
    deep:{top:["Deep Berry","Wine","Plum"],why:"Deep cool skin needs saturated, rich pigment to show up. Berry, wine, and plum create a rich, dimensional flush."}
  },
  neutral: {
    fair:{top:["Baby Pink","Soft Peach","Dusty Rose"],why:"Neutral fair skin is the most flexible — soft pinks and peachy tones both work. Stick to muted, not bright."},
    light:{top:["Peach-Pink","Mauve","Warm Pink"],why:"Light neutral — the sweet spot. Peach-pink and mauve are your best bets for a flush that reads completely natural."},
    medium:{top:["Peach","Warm Rose","Coral-Pink"],why:"Medium neutral has enough melanin to hold warm blush. Peach and warm rose look incredibly fresh."},
    deep:{top:["Coral","Deep Peach","Warm Berry"],why:"Deep neutral can hold both warm and cool blush. Coral, deep peach, and warm berry create stunning contrast."}
  },
  warm: {
    fair:{top:["Peach","Warm Pink","Soft Coral"],why:"Fair warm skin needs warmth in the blush but can't handle heavy pigment. Soft peach and warm pink are perfect."},
    light:{top:["Peach","Coral-Peach","Apricot"],why:"Light warm skin is where peach absolutely shines — it enhances the golden base and looks completely natural."},
    medium:{top:["Coral","Terracotta","Warm Apricot"],why:"Medium warm skin — coral and terracotta are made for you. They amplify your warm base with a sun-kissed look."},
    deep:{top:["Terracotta","Brick","Deep Coral"],why:"Deep warm skin needs rich, saturated warm tones. Terracotta and brick look natural and stunning."}
  }
};

const BLUSH_BRANDS = {
  cool:{luxury:["Charlotte Tilbury Pillow Talk (dusty rose)","NARS Orgasm (berry-pink)","Rare Beauty Soft Pinch in Joy (cool berry)"],mid:["Benefit Dandelion (soft pink)","MAC Margin (cool rose)","Urban Decay Afterglow in Bittersweet"],drugstore:["e.l.f. Putty Blush in Pinky Promise","NYX Sweet Cheeks in Soft Spoken","Wet n Wild ColorIcon in Pearlescent Pink"]},
  neutral:{luxury:["NARS Orgasm (peach-pink)","Rare Beauty Soft Pinch in Happy","Fenty Cheeks Out in Petal Poppin"],mid:["Benefit Georgia (warm peach)","Milani Baked Blush in Luminoso","Too Faced Sweet Peach"],drugstore:["Maybelline Blush Studio in Nude","Revlon Powder Blush in Mauvy","NYX Sweet Cheeks in Peaches and Cream"]},
  warm:{luxury:["NARS Sin (deep warm)","Fenty Cheeks Out in Summertime Wine","Benefit Dallas (terracotta)"],mid:["Milani Coral Cove","NYX Sweet Cheeks in Coral Flower","Urban Decay Afterglow in Blossom"],drugstore:["Wet n Wild ColorIcon in Apricot","e.l.f. Putty Blush in Coral Fixation","L'Oreal Blush Delice in Apricot"]}
};

// Blush brush tip (same for all - applied globally)
const BLUSH_BRUSH_TIP = "Use a fluffy dome blush brush — tap off excess before applying. Smile lightly, sweep from apples upward toward temples. Less product = more control.";
const BLUSH_BRUSH_ICON = "🌸";

const BRONZER_EDU = [
  { type:"Matte Bronzer", hex:"#a07040", what:"Adds depth and dimension — mimics where the sun naturally hits your face. The most natural-looking finish.", best_for:"Contouring, everyday warmth, all skin types", avoid:"Going too heavy — matte bronzer can look muddy if over-applied", when_to_use:"Daily use, natural or office looks" },
  { type:"Shimmer Bronzer", hex:"#c09040", what:"Reflects light to create a glowing, sun-kissed look. More radiant than matte but can emphasize texture.", best_for:"Night out, dewy skin looks, medium to deep skin tones", avoid:"Dry or textured skin — shimmer clings to flaky areas and accentuates pores", when_to_use:"Events, photos, special occasions" },
  { type:"Satin / Soft-Glow Bronzer", hex:"#b08050", what:"The middle ground — a hint of luminosity without full shimmer. Most universally flattering finish.", best_for:"All skin types, all ages, everyday to evening", avoid:"Nothing major — this is the most forgiving finish", when_to_use:"When you want warmth AND a healthy glow without looking glittery" },
  { type:"Bronzing Drops / Liquid", hex:"#c87840", what:"Mixed into foundation or moisturizer for an all-over warmth. Gives the most skin-like, natural result.", best_for:"Fair to medium skin that wants warmth without visible bronzer", avoid:"Using too many drops — start with 1–2 in your moisturizer", when_to_use:"No-makeup makeup looks, summer, beach days" }
];

const BRONZER_DATA = {
  cool: {
    shades:["Taupe","Cool Brown","Ash Brown","Rose-Brown"],
    picks:{luxury:["Charlotte Tilbury Filmstar Bronze in Fair","Fenty Sun Stalk'r in Shady Biz","Hourglass Ambient Lighting Bronzer in Luminous Bronze Light"],mid:["Too Faced Chocolate Soleil (light)","MAC Refined Golden","Benefit Hoola Lite"],drugstore:["e.l.f. Halo Glow Bronzer in Cool Nude","NYX Matte Bronzer in Light","Wet n Wild Reserve Your Cabana"]},
    why:"Cool skin reads porcelain or rosy — a golden or orange bronzer looks completely fake against it. Taupe and ash-brown bronzers mimic natural shadow rather than color, so the effect looks real.",
    avoid:"Orange, golden, or terracotta bronzers — they clash with your pink skin base and look like face paint.",
    application:"Apply lightly to temples, cheekbones, and hairline only. Less is more on cool skin — heavy bronzer reads costume makeup.",
    brush_tip:"Use a large, fluffy angled brush. Tap off excess, then sweep lightly — cool skin shows bronzer more intensely so a light hand is everything.",
    brush_icon:"☀️"
  },
  neutral: {
    shades:["Warm Taupe","Natural Brown","Honey Bronze","Light Caramel"],
    picks:{luxury:["Benefit Hoola (original)","NARS Laguna","Charlotte Tilbury Filmstar Bronze in Medium"],mid:["Physicians Formula Butter Bronzer in Natural","Too Faced Chocolate Soleil in Medium","Urban Decay Beached Bronzer"],drugstore:["Wet n Wild Reserve Your Cabana","Milani Sun Kissed Bronzer","L'Oreal Infallible Longwear Bronzer"]},
    why:"Neutral skin is the most versatile for bronzer. A warm-neutral brown adds believable tan depth. You can go slightly more golden or slightly more taupe and both will work.",
    avoid:"Very orange or very grey bronzers — both extremes look artificial against neutral skin.",
    application:"Build in a '3' shape: temples, cheekbones, jawline. Blend the edges thoroughly.",
    brush_tip:"A medium fluffy brush swept in a '3' shape from forehead to cheekbones to jaw. Blend with circular motions at the edges so there's no hard line.",
    brush_icon:"☀️"
  },
  warm: {
    shades:["Golden Brown","Terracotta","Rich Bronze","Deep Copper"],
    picks:{luxury:["Tom Ford Soleil Neige in Gold Dust","NARS Casino (deep warm)","Fenty Sun Stalk'r in Bajan Gyal"],mid:["Too Faced Chocolate Soleil (deep)","Benefit Hoola Caramel","Tarte Park Ave Princess"],drugstore:["Physicians Formula Butter Bronzer (deep)","L'Oreal Infallible in Golden Hour","NYX Matte Bronzer in Deep"]},
    why:"Warm skin already has a golden base — a rich warm bronzer amplifies this beautifully. The gold and terracotta tones are already in your skin, so they enhance rather than contrast.",
    avoid:"Ashy, cool, or grey-toned bronzers — they completely cancel your natural warmth and look flat.",
    application:"You can be bolder. Sweep across the full face for an all-over warmth. Layer under cheekbones for sculpt.",
    brush_tip:"A large dome or fan brush works beautifully on warm skin. You can afford to be more generous — sweep across the entire face for a full sun-kissed effect.",
    brush_icon:"☀️"
  }
};


// ─── EYESHADOW DATA ──────────────────────────────────────────────────────────

const EYESHADOW_DATA = {
  cool: {
    palette_vibe:"Smoky, mauve, and plum-forward — silvers and icy tones make cool eyes pop",
    base_shades:["Soft lavender","Taupe","Cool grey","Icy white","Mauve"],
    accent_shades:["Plum","Charcoal","Navy","Deep berry","Silver shimmer"],
    avoid:"Warm orange, copper, or bronze shadows — they fight your cool undertone and make eyes look tired instead of striking.",
    palettes:{
      luxury:["Urban Decay Naked3 (rosy mauves)","Charlotte Tilbury Pillow Talk palette","NARS Wanted"],
      mid:["Too Faced Natural Matte","Morphe x Jaclyn Hill (cool tones)","NYX Ultimate Shadow Cool Neutrals"],
      drugstore:["e.l.f. Bite-Size Cool palette","Wet n Wild Color Icon in Rose in the Air","Milani Gilded Rouge"]
    },
    apply_tip:"Layer taupe on the lid, deepen the outer V with plum, and press silver shimmer into the inner corner for instant brightness.",
    brush_tip:"Flat shader brush to pack colour, fluffy blending brush in windshield-wiper motions for seamless transitions. Blending is the entire skill."
  },
  neutral: {
    palette_vibe:"The most versatile eye — earth tones, taupes, and champagne shimmer all work beautifully",
    base_shades:["Warm taupe","Champagne","Vanilla","Light brown","Cream"],
    accent_shades:["Chocolate brown","Warm grey","Rose gold","Deep taupe","Bronze shimmer"],
    avoid:"Very extreme warm (heavy copper) or very extreme cool (heavy blue-grey) — stay balanced.",
    palettes:{
      luxury:["Urban Decay Naked (OG warm neutrals)","Charlotte Tilbury The Golden Hour","Natasha Denona Glam"],
      mid:["Too Faced Natural Love","Anastasia Beverly Hills Soft Glam","Morphe 35O"],
      drugstore:["Maybelline The Nudes palette","NYX Ultimate Shadow Warm Neutrals","e.l.f. Bite-Size Earth"]
    },
    apply_tip:"Champagne lid, soft brown crease, deep taupe outer V — a wearable, dimensional eye that suits every occasion.",
    brush_tip:"Medium flat brush for shimmer lids, tapered crease brush for depth, pencil brush to pack pigment into the outer corner."
  },
  warm: {
    palette_vibe:"Copper, bronze, gold, terracotta — warm undertones make metallics look like they belong on your face",
    base_shades:["Golden champagne","Warm peach","Cream","Bronze","Soft copper"],
    accent_shades:["Deep bronze","Burnt orange","Chocolate","Rich copper","Gold shimmer"],
    avoid:"Cool grey, silver, and lavender shadows — they wash out warm eyes and fight your golden base.",
    palettes:{
      luxury:["Urban Decay Naked Heat","Charlotte Tilbury The Golden Goddess","Pat McGrath Mothership V Bronze Temptation"],
      mid:["Too Faced Sweet Peach","Anastasia Beverly Hills Riviera","Huda Beauty Desert Dusk"],
      drugstore:["NYX Ultimate Shadow Warm Reds","Milani Copper Glow","e.l.f. Bite-Size Bronze"]
    },
    apply_tip:"Pack copper or bronze shimmer all over the lid, deepen the outer V with chocolate, smudge shimmer under the lower lash line for intensity.",
    brush_tip:"Press shimmer with your fingertip first for full intensity, then blend edges with a flat brush. Fingers beat brushes for metallic payoff."
  }
};

const EVENT_LOOKS = {
  daytime:{
    icon:"☀️", name:"Daytime / Everyday",
    vibe:"Fresh, effortless, polished. You look put-together without looking like you tried too hard.",
    cool:{lid:"Soft taupe shimmer",crease:"Cool grey-brown",liner:"Brown pencil or none",lash:"One coat mascara",tip:"One shimmer shade on the lid with a taupe crease is all you need. Keep it light."},
    neutral:{lid:"Champagne shimmer",crease:"Warm taupe",liner:"Brown pencil",lash:"One coat mascara",tip:"Champagne lid with taupe crease is universally flattering and ready in 3 minutes."},
    warm:{lid:"Peach or warm gold",crease:"Soft brown",liner:"Bronze pencil",lash:"One coat mascara",tip:"Peachy-gold on warm skin looks effortlessly glowing — like the light just hit you right."}
  },
  date:{
    icon:"🌹", name:"Date Night",
    vibe:"Sultry but not overdone. Defined, dimensional, a little mysterious.",
    cool:{lid:"Soft mauve shimmer",crease:"Plum or deep berry",liner:"Dark brown smudged pencil",lash:"Two coats + lower lash mascara",tip:"Smudge the liner slightly — too perfect is too stiff for a date. Soft and smoky is the move."},
    neutral:{lid:"Rose gold shimmer",crease:"Warm chocolate",liner:"Dark brown smudged pencil",lash:"Two coats + curl",tip:"Rose gold catches candlelight beautifully. Press white shimmer into the inner corner to open the eye."},
    warm:{lid:"Rich copper or bronze",crease:"Deep chocolate",liner:"Bronze pencil smudged",lash:"Two coats + curl",tip:"Bronze on warm skin is magnetic under dim lighting. Pack it intensely on the lid, keep everything else minimal."}
  },
  wedding:{
    icon:"🤍", name:"Wedding / Formal",
    vibe:"Timeless, photo-ready, camera-proof. Looks as good at 10pm as it did at 10am.",
    cool:{lid:"Icy champagne or soft pink shimmer",crease:"Taupe or soft mauve",liner:"Black liquid liner — thin and precise",lash:"Full lashes or volumising mascara",tip:"Use eye primer — wedding days are long. Set with translucent powder so nothing creases."},
    neutral:{lid:"Champagne to warm gold",crease:"Soft taupe or brown",liner:"Dark brown or black",lash:"Full lashes",tip:"Build in thin layers for longevity. A setting spray over finished eyes locks everything for hours."},
    warm:{lid:"Gold or champagne shimmer",crease:"Warm bronze or brown",liner:"Brown liquid liner",lash:"Full lashes",tip:"Warm gold photographs beautifully — it adds dimension without looking heavy in pictures."}
  },
  club:{
    icon:"✨", name:"Club / Night Out",
    vibe:"Bold. Maximum impact. This is the look that gets you compliments from strangers.",
    cool:{lid:"Full silver or icy lavender shimmer",crease:"Charcoal or black",liner:"Black gel — winged",lash:"Dramatic false lashes",tip:"Go 30% more intense than you think you need. Club lighting eats subtlety. Pack shimmer with your finger."},
    neutral:{lid:"Bronze to champagne gradient",crease:"Deep taupe or black",liner:"Black gel winged",lash:"Dramatic false lashes",tip:"Cut the crease with concealer for a sharp graphic look. Neutral skin carries bold liner cleanly."},
    warm:{lid:"Full copper or gold glitter",crease:"Deep chocolate or black",liner:"Black gel liner",lash:"Dramatic false lashes",tip:"Copper glitter on warm skin under club lighting is unforgettable. Use lash glue as glitter adhesive."}
  },
  natural:{
    icon:"🌿", name:"No-Makeup Makeup",
    vibe:"You look well-rested and glowy — not 'done'. The most wearable look in the collection.",
    cool:{lid:"Soft pink or lavender shimmer wash",crease:"Pale taupe — barely there",liner:"Thinnest brown pencil at roots only",lash:"Clear mascara or one coat brown",tip:"The secret is a tinted moisturiser, cream blush, and a touch of shimmer in the inner corner only."},
    neutral:{lid:"Vanilla or skin-tone shimmer",crease:"One shade deeper than your skin",liner:"Nude pencil on waterline",lash:"Clear mascara",tip:"Match the shimmer to your skin tone exactly. The goal is enhanced-you, not different-person."},
    warm:{lid:"Champagne or peachy shimmer",crease:"Soft warm taupe",liner:"Brown pencil on lower waterline",lash:"Brown mascara",tip:"Warm skin glows beautifully with a single peachy shimmer pressed onto the centre of the lid with your finger."}
  }
};

const HOW_TO_APPLY = [
  {step:1,title:"Prime first",icon:"⚡",tip:"Eye primer or a thin layer of concealer on the lid. Without it shadows crease within hours. This single step adds 4–6 hours to your wear time."},
  {step:2,title:"Light base shade",icon:"🌕",tip:"Sweep a light neutral across the entire lid and brow bone. Creates a seamless base for darker shades to blend into."},
  {step:3,title:"Deepen the crease",icon:"🌗",tip:"Fluffy brush in windshield-wiper motions, blend a medium shade into the crease. Start lighter than you think — build up slowly."},
  {step:4,title:"Pack the lid",icon:"⭐",tip:"Press your statement shade onto the lid with a flat brush. Press don't swipe — swiping spreads pigment thin and kills payoff."},
  {step:5,title:"Outer V",icon:"🌑",tip:"Darkest shade into the outer corner in a V shape. Blend inward and upward — this creates depth and a sultry hooded effect."},
  {step:6,title:"Inner corner highlight",icon:"✨",tip:"Light shimmer pressed into the inner corner opens the eye dramatically. Transforms a closed eye into a wide-awake one instantly."},
  {step:7,title:"Blend everything",icon:"🔄",tip:"Clean fluffy brush over all harsh lines. No hard edges anywhere. This one step separates polished from unfinished."},
  {step:8,title:"Mascara last",icon:"🪄",tip:"Two coats on curled lashes, or false lashes for events. Always apply mascara last — it gets on everything if you do it first."}
];

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "teinte_saved_profiles";

function loadProfiles(): any[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveProfile(profile: any): any[] {
  try {
    const profiles = loadProfiles();
    const updated = [profile, ...profiles.filter((p: any) => p.id !== profile.id)].slice(0, 5);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch { return []; }
}
function deleteProfile(id: any): any[] {
  try {
    const profiles = loadProfiles().filter((p: any) => p.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profiles;
  } catch { return []; }
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function Tag({ children, color }) {
  return <span style={{ display:"inline-block", padding:"3px 12px", borderRadius:100, fontSize:12, fontWeight:500, border:`1px solid ${color}`, background:color+"18", color }}>{children}</span>;
}

function AvoidBox({ text }) {
  return (
    <div style={{ display:"flex", gap:10, background:"#fff5f5", border:"1px solid #f0c0c0", borderRadius:10, padding:"12px 16px" }}>
      <span style={{ fontSize:14, flexShrink:0 }}>⚠️</span>
      <p style={{ fontSize:13, color:"#b05050", lineHeight:1.6 }}>{text}</p>
    </div>
  );
}

function ProTip({ text }) {
  return (
    <div style={{ display:"flex", gap:10, background:"#f5f0ff", border:"1px solid #c8b8f0", borderRadius:10, padding:"12px 16px" }}>
      <span style={{ fontSize:14, flexShrink:0 }}>✨</span>
      <p style={{ fontSize:13, color:"#6040a0", lineHeight:1.6 }}><strong>Pro tip:</strong> {text}</p>
    </div>
  );
}

function BrushTip({ text, icon }) {
  return (
    <div style={{ display:"flex", gap:10, background:"#f0faf5", border:"1px solid #a0d8b8", borderRadius:10, padding:"12px 16px" }}>
      <span style={{ fontSize:16, flexShrink:0 }}>🪥</span>
      <p style={{ fontSize:13, color:"#206040", lineHeight:1.6 }}><strong>Best brush:</strong> {text}</p>
    </div>
  );
}

function SectionTitle({ icon, title, step, total }) {
  return (
    <div style={{ marginBottom:20 }}>
      <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:"#9a8878", marginBottom:6 }}>Step {step} of {total}</p>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:26, fontWeight:400, color:"#1a1410" }}>{title}</h2>
      </div>
    </div>
  );
}

function BrandTabs({ brands, color }) {
  const [tab, setTab] = useState("luxury");
  const labels = { luxury:"Luxury", mid:"Mid-range", drugstore:"Drugstore" };
  return (
    <div>
      <div style={{ display:"flex", gap:6, marginBottom:12 }}>
        {["luxury","mid","drugstore"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"5px 14px", borderRadius:100, fontSize:12, fontWeight:500, cursor:"pointer", border:`1.5px solid ${tab===t?color:"#e0d8d0"}`, background:tab===t?color+"18":"transparent", color:tab===t?color:"#9a8878" }}>{labels[t]}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {brands[tab].map(b => (
          <div key={b} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#faf6f1", borderRadius:8, border:"1px solid #e8e0d4" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:color, flexShrink:0 }} />
            <span style={{ fontSize:13, color:"#2a2018" }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NextBtn({ label, onClick }) {
  return <button onClick={onClick} style={{ width:"100%", marginTop:20, padding:"14px", borderRadius:100, border:"none", background:"#1a1410", color:"#faf6f1", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>{label}</button>;
}

// ─── BRAND SEARCH ──────────────────────────────────────────────────────────────

function BrandSearch({ undertone, depth }) {
  const c = UNDERTONE_DATA[undertone].color;
  const ut = UNDERTONE_DATA[undertone];
  const fd = FOUNDATION_DATA[undertone];
  const dd = fd.depth_ranges[depth];
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState("");
  const inputRef = useRef();

  const search = async () => {
    const brand = query.trim(); if (!brand) return;
    setLoading(true); setResult(null); setError(null); setSearched(brand);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:`You are an expert makeup artist. A customer has: undertone=${ut.label}, depth=${depth}, foundation range=${dd.range} (${dd.keywords.join(", ")}), undertone code=${undertone==="cool"?"C":undertone==="warm"?"W":"N"}. Find their shades from "${brand}". If brand doesn't make a category say "N/A". Respond ONLY with JSON no markdown: {"brand_exists":true,"brand_name":"official name","foundation":{"shade":"name+number","confidence":"high/medium/low","why":"brief"},"concealer":{"shade":"name or N/A","confidence":"high/medium/low","why":"brief"},"blush":{"shade":"name or N/A","confidence":"high/medium/low","why":"brief"},"bronzer":{"shade":"name or N/A","confidence":"high/medium/low","why":"brief"},"general_tip":"one practical tip"}` }] })
      });
      const d = await resp.json();
      const txt = d.content.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim();
      setResult(JSON.parse(txt));
    } catch { setError("Couldn't look up that brand. Check the spelling and try again."); }
    finally { setLoading(false); }
  };

  const confidenceBadge = (level) => {
    const map = { high:["#e0f5e0","#80c080","#307030","High Confidence"], medium:["#fff8e0","#e0c060","#806010","Best Estimate"], low:["#fff0e0","#e0a060","#804010","Approximate"] };
    const [bg,border,text,label] = map[level]||map.medium;
    return <span style={{ fontSize:10, padding:"2px 10px", borderRadius:100, background:bg, border:`1px solid ${border}`, color:text, fontWeight:700 }}>{label}</span>;
  };

  const productRow = (icon, label, data) => {
    if (!data || data.shade==="N/A") return (
      <div style={{ padding:"10px 14px", background:"#f5f5f5", borderRadius:10, marginBottom:8, opacity:0.6 }}>
        <span style={{ fontSize:12, color:"#9a8878" }}>{icon} {label} — not available from this brand</span>
      </div>
    );
    return (
      <div style={{ padding:"14px", background:"rgba(255,255,255,0.7)", border:"1px solid #e8e0d4", borderRadius:10, marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
          <span style={{ fontSize:13 }}>{icon}</span>
          <span style={{ fontSize:11, fontWeight:600, color:"#9a8878", textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</span>
          <div style={{ marginLeft:"auto" }}>{confidenceBadge(data.confidence)}</div>
        </div>
        <p style={{ fontFamily:"'Playfair Display', serif", fontSize:17, color:"#1a1410", marginBottom:5 }}>{data.shade}</p>
        <p style={{ fontSize:12, color:"#7a6b5d", lineHeight:1.6 }}>{data.why}</p>
      </div>
    );
  };

  return (
    <div style={{ marginTop:32 }}>
      <div style={{ background:`linear-gradient(135deg, ${c}18 0%, ${c}06 100%)`, border:`2px solid ${c}`, borderRadius:18, padding:"22px 20px 20px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:110, height:110, borderRadius:"50%", background:c+"14", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-20, left:-20, width:70, height:70, borderRadius:"50%", background:c+"10", pointerEvents:"none" }} />

        <div style={{ display:"flex", alignItems:"flex-start", gap:12, marginBottom:16, position:"relative" }}>
          <div style={{ width:42, height:42, borderRadius:12, background:c, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:20 }}>🔍</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
              <p style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:400, color:"#1a1410" }}>Search Any Brand</p>
              <span style={{ fontSize:9, padding:"2px 9px", borderRadius:100, background:c, color:"#fff", fontWeight:700, letterSpacing:"0.06em" }}>NEW</span>
            </div>
            <p style={{ fontSize:12, color:"#7a6b5d", lineHeight:1.55 }}>Don't see your brand? Search it — we'll find your exact shades for foundation, concealer, blush, and bronzer.</p>
          </div>
        </div>

        <div style={{ background:"rgba(255,255,255,0.72)", borderRadius:12, padding:"13px 14px", marginBottom:16, position:"relative" }}>
          <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:10 }}>Every result includes a confidence rating</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["High Confidence","#e0f5e0","#80c080","#307030","Exact shade confirmed — safe to buy"],["Best Estimate","#fff8e0","#e0c060","#806010","Very likely correct — try this first"],["Approximate","#fff0e0","#e0a060","#804010","Good starting point — verify in-store"]].map(([label,bg,border,text,desc]) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:10, padding:"2px 10px", borderRadius:100, background:bg, border:`1px solid ${border}`, color:text, fontWeight:700, whiteSpace:"nowrap", flexShrink:0 }}>{label}</span>
                <span style={{ fontSize:12, color:"#5a5048", lineHeight:1.4 }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:8, marginBottom:6 }}>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()} placeholder="e.g. Rare Beauty, Elf, Fenty, Dior..."
            style={{ flex:1, padding:"13px 18px", borderRadius:100, border:`1.5px solid ${query?c:"#d8cfc4"}`, background:"#fff9f4", fontSize:13, fontFamily:"'DM Sans', sans-serif", color:"#1a1410", outline:"none", transition:"all 0.2s", boxShadow:query?`0 0 0 3px ${c}25`:"none" }} />
          <button onClick={search} disabled={loading||!query.trim()} style={{ padding:"13px 20px", borderRadius:100, border:"none", background:query.trim()?"#1a1410":"#c8bfb4", color:"#faf6f1", fontSize:13, fontWeight:500, cursor:query.trim()?"pointer":"default", fontFamily:"'DM Sans', sans-serif", whiteSpace:"nowrap" }}>{loading?"...":"Search ✦"}</button>
        </div>
        <p style={{ fontSize:11, color:c+"99", textAlign:"center", marginBottom:(loading||result||error)?16:0 }}>Press Enter or tap Search · Works with any brand worldwide</p>

        {loading && (
          <div style={{ textAlign:"center", padding:"28px 0 8px" }}>
            <div style={{ width:36, height:36, border:"2px solid #e8e0d4", borderTopColor:c, borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 14px" }} />
            <p style={{ fontFamily:"'Playfair Display', serif", fontSize:16, color:"#1a1410", marginBottom:4 }}>Looking up {searched}...</p>
            <p style={{ fontSize:12, color:"#9a8878" }}>Finding the right shades for your skin profile</p>
          </div>
        )}

        {error && <div style={{ background:"#fff5f5", border:"1px solid #f0c0c0", borderRadius:10, padding:"14px 16px", marginTop:4 }}><p style={{ fontSize:13, color:"#b05050" }}>{error}</p></div>}

        {result && !loading && (
          <div style={{ animation:"fadeIn 0.3s ease", marginTop:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(255,255,255,0.7)", border:`1.5px solid ${c}`, borderRadius:12, marginBottom:14 }}>
              <span style={{ fontSize:18 }}>🛍️</span>
              <div>
                <p style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:c, marginBottom:2 }}>Shades for your skin</p>
                <p style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontWeight:400, color:"#1a1410" }}>{result.brand_name}</p>
              </div>
            </div>
            {productRow("🏛️","Foundation",result.foundation)}
            {productRow("🎭","Concealer",result.concealer)}
            {productRow("🌸","Blush",result.blush)}
            {productRow("☀️","Bronzer",result.bronzer)}
            {result.general_tip && (
              <div style={{ display:"flex", gap:10, background:"rgba(245,240,255,0.9)", border:"1px solid #c8b8f0", borderRadius:10, padding:"12px 16px", marginTop:8 }}>
                <span style={{ fontSize:14, flexShrink:0 }}>✨</span>
                <p style={{ fontSize:13, color:"#6040a0", lineHeight:1.6 }}><strong>Brand tip:</strong> {result.general_tip}</p>
              </div>
            )}
            <button onClick={() => { setResult(null); setQuery(""); setSearched(""); inputRef.current?.focus(); }}
              style={{ width:"100%", marginTop:14, padding:"11px", borderRadius:100, border:`1.5px solid ${c}60`, background:"transparent", fontSize:12, color:c, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Search another brand →</button>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── EYESHADOW FEATURE (PAID) ─────────────────────────────────────────────────

function EyeshadowFeature({ undertone, depth }) {
  const c = UNDERTONE_DATA[undertone].color;
  const data = EYESHADOW_DATA[undertone];
  const [unlocked, setUnlocked] = useState(false);
  const [tab, setTab] = useState("looks");
  const [selectedLook, setSelectedLook] = useState("daytime");
  const [openStep, setOpenStep] = useState(null);
  const [palTab, setPalTab] = useState("luxury");

  const looks = Object.entries(EVENT_LOOKS);

  if (!unlocked) return (
    <div style={{ marginTop:32 }}>
      <div style={{ background:"linear-gradient(135deg, #1a1410 0%, #3d2510 100%)", borderRadius:18, padding:"28px 22px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(196,149,106,0.15)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-30, left:-30, width:100, height:100, borderRadius:"50%", background:"rgba(196,149,106,0.1)", pointerEvents:"none" }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>💎</div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 14px", borderRadius:100, background:"rgba(196,149,106,0.25)", border:"1px solid #c4956a", marginBottom:14 }}>
            <span style={{ fontSize:10, color:"#c4956a", fontWeight:700, letterSpacing:"0.12em" }}>PREMIUM FEATURE</span>
          </div>
          <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:400, color:"#faf6f1", marginBottom:10 }}>Eyeshadow Guide</h3>
          <p style={{ fontSize:13, color:"#c4b090", lineHeight:1.7, marginBottom:20 }}>
            Unlock your personalised eyeshadow palette, 5 complete event looks — daytime, date night, wedding, club, and no-makeup — plus a step-by-step application tutorial and brush guide tailored to your {UNDERTONE_DATA[undertone].label.toLowerCase()} undertone.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22, textAlign:"left" }}>
            {[["👁️","Palette picks matched to your undertone"],["🌹","5 complete event looks with exact steps"],["🪥","Which brushes to use and exactly how"],["✨","Application tutorial from prime to mascara"]].map(([icon,text]) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:14 }}>{icon}</span>
                <span style={{ fontSize:13, color:"#d4c4a8" }}>{text}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setUnlocked(true)} style={{ width:"100%", padding:"14px", borderRadius:100, border:"none", background:"#c4956a", color:"#1a1410", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"'DM Sans', sans-serif", letterSpacing:"0.04em" }}>
            ✦ Unlock Eyeshadow Guide — $4.99/mo
          </button>
          <p style={{ fontSize:11, color:"#9a8878", marginTop:10 }}>Demo: tap to preview the full feature</p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ marginTop:32 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"#1a1410", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👁️</div>
        <div>
          <p style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:400, color:"#1a1410" }}>Eyeshadow Guide</p>
          <p style={{ fontSize:11, color:"#9a8878" }}>{data.palette_vibe}</p>
        </div>
        <div style={{ marginLeft:"auto", padding:"3px 10px", borderRadius:100, background:"#c4956a20", border:"1px solid #c4956a" }}>
          <span style={{ fontSize:10, color:"#c4956a", fontWeight:700 }}>PREMIUM</span>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:6, margin:"16px 0" }}>
        {[["looks","Event Looks"],["palette","Palette"],["tutorial","How To Apply"]].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ flex:1, padding:"9px 4px", borderRadius:100, border:`1.5px solid ${tab===key?c:"#e0d8d0"}`, background:tab===key?c+"18":"transparent", color:tab===key?c:"#9a8878", fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>{label}</button>
        ))}
      </div>

      {/* TAB: EVENT LOOKS */}
      {tab==="looks" && (
        <div style={{ animation:"fadeIn 0.2s ease" }}>
          <p style={{ fontSize:12, color:"#7a6b5d", marginBottom:14, lineHeight:1.6 }}>Select an occasion — each look is fully tailored to your {UNDERTONE_DATA[undertone].label.toLowerCase()} undertone with exact shades and pro tips.</p>

          {/* Look selector */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:16 }}>
            {looks.map(([key, look]) => (
              <button key={key} onClick={() => setSelectedLook(key)} style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 14px", borderRadius:14, border:`1.5px solid ${selectedLook===key?c:"#e8e0d4"}`, background:selectedLook===key?c+"15":"#faf6f1", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", minWidth:70 }}>
                <span style={{ fontSize:20 }}>{look.icon}</span>
                <span style={{ fontSize:10, fontWeight:500, color:selectedLook===key?c:"#9a8878", textAlign:"center", lineHeight:1.3 }}>{look.name.split("/")[0].trim()}</span>
              </button>
            ))}
          </div>

          {/* Selected look detail */}
          {(() => {
            const look = EVENT_LOOKS[selectedLook];
            const details = look[undertone];
            return (
              <div style={{ border:`1.5px solid ${c}50`, borderRadius:14, overflow:"hidden", animation:"fadeIn 0.2s ease" }}>
                <div style={{ background:c+"15", padding:"16px 18px", borderBottom:`1px solid ${c}30` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                    <span style={{ fontSize:24 }}>{look.icon}</span>
                    <div>
                      <p style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:"#1a1410" }}>{look.name}</p>
                      <p style={{ fontSize:12, color:"#7a6b5d" }}>{look.vibe}</p>
                    </div>
                  </div>
                </div>
                <div style={{ padding:"16px 18px" }}>
                  {[["Lid shade", details.lid],["Crease", details.crease],["Liner", details.liner],["Lashes", details.lash]].map(([label, val]) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"9px 0", borderBottom:"1px solid #f0ece8" }}>
                      <span style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:"#9a8878", flexShrink:0, marginRight:12, paddingTop:1 }}>{label}</span>
                      <span style={{ fontSize:13, color:"#1a1410", textAlign:"right", lineHeight:1.5 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop:14, display:"flex", gap:10, background:c+"10", border:`1px solid ${c}30`, borderRadius:10, padding:"12px 14px" }}>
                    <span style={{ flexShrink:0 }}>💡</span>
                    <p style={{ fontSize:13, color:"#2a2018", lineHeight:1.65 }}>{details.tip}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB: PALETTE */}
      {tab==="palette" && (
        <div style={{ animation:"fadeIn 0.2s ease" }}>
          <div style={{ background:c+"12", border:`1.5px solid ${c}`, borderRadius:12, padding:"16px", marginBottom:14 }}>
            <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:c, marginBottom:10 }}>Base shades — always in your kit</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
              {data.base_shades.map(s => <span key={s} style={{ padding:"4px 12px", borderRadius:100, fontSize:12, border:`1px solid ${c}`, background:c+"18", color:c, fontWeight:500 }}>{s}</span>)}
            </div>
            <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:c, marginBottom:10 }}>Accent shades — for depth and drama</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {data.accent_shades.map(s => <span key={s} style={{ padding:"4px 12px", borderRadius:100, fontSize:12, border:`1px solid ${c}80`, background:"#faf6f1", color:"#1a1410", fontWeight:400 }}>{s}</span>)}
            </div>
          </div>

          <div style={{ background:"#fff5f5", border:"1px solid #f0c0c0", borderRadius:10, padding:"12px 16px", marginBottom:14 }}>
            <div style={{ display:"flex", gap:8 }}>
              <span style={{ flexShrink:0 }}>⚠️</span>
              <p style={{ fontSize:13, color:"#b05050", lineHeight:1.6 }}><strong>Avoid:</strong> {data.avoid}</p>
            </div>
          </div>

          <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:12 }}>Recommended palettes</p>
          <div style={{ display:"flex", gap:6, marginBottom:12 }}>
            {["luxury","mid","drugstore"].map(t => (
              <button key={t} onClick={() => setPalTab(t)} style={{ flex:1, padding:"6px 4px", borderRadius:100, border:`1.5px solid ${palTab===t?c:"#e0d8d0"}`, background:palTab===t?c+"18":"transparent", color:palTab===t?c:"#9a8878", fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>{{luxury:"Luxury",mid:"Mid",drugstore:"Drugstore"}[t]}</button>
            ))}
          </div>
          {data.palettes[palTab].map(p => (
            <div key={p} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", background:"#faf6f1", borderRadius:8, border:"1px solid #e8e0d4", marginBottom:8 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:c, flexShrink:0 }} />
              <span style={{ fontSize:13, color:"#2a2018" }}>{p}</span>
            </div>
          ))}

          <div style={{ background:"#f0faf5", border:"1px solid #a0d8b8", borderRadius:10, padding:"12px 14px", marginTop:4 }}>
            <div style={{ display:"flex", gap:8 }}>
              <span>🪥</span>
              <p style={{ fontSize:13, color:"#206040", lineHeight:1.6 }}><strong>Brush tip:</strong> {data.brush_tip}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: TUTORIAL */}
      {tab==="tutorial" && (
        <div style={{ animation:"fadeIn 0.2s ease" }}>
          <p style={{ fontSize:13, color:"#7a6b5d", marginBottom:14, lineHeight:1.6 }}>Follow these 8 steps in order every time — tap each to expand. This is the order professionals use.</p>

          {HOW_TO_APPLY.map((item, i) => (
            <div key={item.step} style={{ marginBottom:8, border:`1px solid ${openStep===i?c:"#e8e0d4"}`, borderRadius:12, overflow:"hidden" }}>
              <button onClick={() => setOpenStep(openStep===i?null:i)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:openStep===i?c+"10":"#faf6f1", border:"none", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", textAlign:"left" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:openStep===i?c:"#e8e0d4", color:openStep===i?"#fff":"#9a8878", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{item.step}</div>
                <span style={{ fontSize:14, fontWeight:500, color:"#1a1410", flex:1 }}>{item.title}</span>
                <span style={{ fontSize:18 }}>{item.icon}</span>
              </button>
              {openStep===i && (
                <div style={{ padding:"0 16px 14px 58px", borderTop:`1px solid ${c}30`, animation:"fadeIn 0.2s ease" }}>
                  <p style={{ fontSize:13, color:"#2a2018", lineHeight:1.7, marginTop:12 }}>{item.tip}</p>
                </div>
              )}
            </div>
          ))}

          <div style={{ background:c+"12", border:`1.5px solid ${c}`, borderRadius:12, padding:"14px 16px", marginTop:16 }}>
            <p style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:c, marginBottom:8 }}>Your personal apply tip</p>
            <p style={{ fontSize:13, color:"#2a2018", lineHeight:1.7 }}>{data.apply_tip}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCREENS ──────────────────────────────────────────────────────────────────

function Welcome({ onStart, onViewSaved, savedCount }) {
  return (
    <div style={{ textAlign:"center", paddingTop:20 }}>
      <div style={{ fontSize:48, marginBottom:16 }}>✦</div>
      <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:32, fontWeight:400, lineHeight:1.25, marginBottom:14, color:"#1a1410" }}>Your personal<br /><em style={{ color:"#c4956a" }}>beauty advisor</em></h1>
      <p style={{ fontSize:14, color:"#7a6b5d", lineHeight:1.75, marginBottom:28, maxWidth:320, margin:"0 auto 28px" }}>Upload a photo of your wrist or bare face. We'll analyze your undertone and build your complete shade profile — with the <em>why</em> behind every recommendation.</p>

      <div style={{ background:"#fff9f4", border:"1px solid #e8e0d4", borderRadius:14, padding:"20px 24px", marginBottom:20, textAlign:"left" }}>
        {[["🏛️","Foundation","Exact shade range + brand codes explained"],["🎭","Concealer","Under-eye, blemish, brightening and correcting"],["🌸","Blush","What each color does and why it works or doesn't"],["☀️","Bronzer","Types, techniques, and what bronzer actually does"],["🪥","Brush tips","Best application tool on every single page"]].map(([icon,title,desc]) => (
          <div key={title} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:14 }}>
            <span style={{ fontSize:18 }}>{icon}</span>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:"#1a1410", marginBottom:2 }}>{title}</p>
              <p style={{ fontSize:12, color:"#9a8878" }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{ background:"#1a1410", color:"#faf6f1", border:"none", padding:"14px 36px", borderRadius:100, fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500, letterSpacing:"0.04em", cursor:"pointer", width:"100%", marginBottom:12 }}>Begin My Analysis ✦</button>

      {savedCount > 0 && (
        <button onClick={onViewSaved} style={{ background:"transparent", color:"#9a8878", border:"1.5px solid #e8e0d4", padding:"12px 36px", borderRadius:100, fontFamily:"'DM Sans', sans-serif", fontSize:13, cursor:"pointer", width:"100%" }}>
          📋 View Saved Profiles ({savedCount})
        </button>
      )}
    </div>
  );
}

function SavedProfiles({ profiles, onLoad, onDelete, onBack }) {
  const labels = { cool:"Cool", neutral:"Neutral", warm:"Warm" };
  const colors = { cool:"#9b8ec4", neutral:"#b89b72", warm:"#c47d3a" };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#9a8878" }}>←</button>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontWeight:400, color:"#1a1410" }}>Saved Profiles</h2>
      </div>

      {profiles.length === 0 ? (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"#9a8878" }}>
          <p style={{ fontSize:32, marginBottom:12 }}>📋</p>
          <p style={{ fontSize:14 }}>No saved profiles yet. Complete an analysis to save your results.</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {profiles.map(p => {
            const c = colors[p.undertone] || "#c4956a";
            return (
              <div key={p.id} style={{ background:"#faf6f1", border:`1.5px solid ${c}50`, borderRadius:14, padding:"16px 18px" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:c+"30", border:`2px solid ${c}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:14 }}>✦</span>
                    </div>
                    <div>
                      <p style={{ fontFamily:"'Playfair Display', serif", fontSize:16, color:"#1a1410", fontWeight:400 }}>{labels[p.undertone]} · {p.depth.charAt(0).toUpperCase()+p.depth.slice(1)}</p>
                      <p style={{ fontSize:11, color:"#9a8878" }}>{new Date(p.savedAt).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}</p>
                    </div>
                  </div>
                  <button onClick={() => onDelete(p.id)} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", color:"#c0b0a0", padding:"4px" }}>✕</button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
                  {(FOUNDATION_DATA[p.undertone]?.depth_ranges[p.depth]?.keywords||[]).slice(0,2).map(k => <Tag key={k} color={c}>{k}</Tag>)}
                  {(BLUSH_RECS[p.undertone]?.[p.depth]?.top||[]).slice(0,1).map(k => <Tag key={k} color={c}>{k} blush</Tag>)}
                </div>
                <button onClick={() => onLoad(p)} style={{ width:"100%", padding:"10px", borderRadius:100, border:"none", background:c, color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Load This Profile →</button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop:20, padding:"14px 16px", background:"#fff9f4", border:"1px solid #e8e0d4", borderRadius:10 }}>
        <p style={{ fontSize:12, color:"#9a8878", lineHeight:1.6 }}>💡 Save up to 5 profiles — useful if you're between shades seasonally or want to compare skin tones for different looks.</p>
      </div>
    </div>
  );
}

function Capture({ onAnalyze, onManual }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const handleFile = e => { const f=e.target.files[0]; if(!f)return; setFile(f); const r=new FileReader(); r.onload=ev=>setPreview(ev.target.result); r.readAsDataURL(f); };
  return (
    <div>
      <SectionTitle icon="📸" title="Upload Your Photo" step={1} total={8} />
      <div style={{ display:"flex", gap:10, background:"#fff8ee", border:"1px solid #e8c87a", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
        <span>💡</span>
        <p style={{ fontSize:12, color:"#7a5a10", lineHeight:1.6 }}>Photo of your <strong>inner wrist</strong> or <strong>bare face</strong> in natural daylight. No flash, no filter.</p>
      </div>
      {!preview ? (
        <div onClick={() => fileRef.current.click()} style={{ border:"2px dashed #d8cfc4", borderRadius:14, padding:"48px 24px", textAlign:"center", cursor:"pointer", background:"#faf6f1" }}>
          <div style={{ fontSize:32, marginBottom:10 }}>📷</div>
          <p style={{ fontFamily:"'Playfair Display', serif", fontSize:18, marginBottom:6, color:"#1a1410" }}>Upload a photo</p>
          <p style={{ fontSize:12, color:"#9a8878" }}>Wrist or bare face · Natural light · No flash</p>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display:"none" }} />
        </div>
      ) : (
        <div>
          <img src={preview} alt="preview" style={{ width:"100%", borderRadius:14, maxHeight:280, objectFit:"cover", marginBottom:14 }} />
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => { setPreview(null); setFile(null); }} style={{ flex:1, padding:"12px", borderRadius:100, border:"1.5px solid #d8cfc4", background:"transparent", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Retake</button>
            <button onClick={() => onAnalyze(file,preview)} style={{ flex:2, padding:"12px", borderRadius:100, border:"none", background:"#1a1410", color:"#faf6f1", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>Analyze My Skin ✦</button>
          </div>
        </div>
      )}
      <div style={{ textAlign:"center", marginTop:20 }}>
        <button onClick={onManual} style={{ background:"none", border:"none", fontSize:13, color:"#9a8878", cursor:"pointer", textDecoration:"underline", fontFamily:"'DM Sans', sans-serif" }}>Skip — choose manually</button>
      </div>
    </div>
  );
}

function Analyzing({ preview }) {
  return (
    <div style={{ textAlign:"center", paddingTop:20 }}>
      {preview && <img src={preview} alt="" style={{ width:"100%", maxHeight:200, objectFit:"cover", borderRadius:12, marginBottom:24 }} />}
      <div style={{ width:44, height:44, border:"2px solid #e8e0d4", borderTopColor:"#c4956a", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 20px" }} />
      <p style={{ fontFamily:"'Playfair Display', serif", fontSize:22, marginBottom:8, color:"#1a1410" }}>Analyzing your skin...</p>
      <p style={{ fontSize:13, color:"#9a8878" }}>Reading vein color, skin cast, and depth</p>
    </div>
  );
}

function Manual({ onDone }) {
  const [ut, setUt] = useState(null);
  const [dp, setDp] = useState(null);
  const Opt = ({ group, val, label, desc, setter }) => (
    <button onClick={() => setter(val)} style={{ display:"block", width:"100%", textAlign:"left", padding:"14px 16px", borderRadius:10, border:`1.5px solid ${group===val?"#c4956a":"#e8e0d4"}`, background:group===val?"#fff0e0":"#faf6f1", cursor:"pointer", marginBottom:8, fontFamily:"'DM Sans', sans-serif" }}>
      <p style={{ fontSize:14, fontWeight:500, color:"#1a1410", marginBottom:2 }}>{label}</p>
      <p style={{ fontSize:12, color:"#9a8878" }}>{desc}</p>
    </button>
  );
  return (
    <div>
      <SectionTitle icon="👁️" title="Tell Us About Your Skin" step={1} total={8} />
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:10 }}>Check your inner wrist — what color are your veins?</p>
        <Opt group={ut} val="cool" label="Blue or Purple" desc="Distinctly blue or purple-tinted veins" setter={setUt} />
        <Opt group={ut} val="neutral" label="Blue-Green Mix" desc="Hard to tell — looks like both colors" setter={setUt} />
        <Opt group={ut} val="warm" label="Greenish" desc="Clearly green-tinted veins" setter={setUt} />
      </div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:10 }}>Your skin depth</p>
        <Opt group={dp} val="fair" label="Fair" desc="Very pale, burns easily" setter={setDp} />
        <Opt group={dp} val="light" label="Light" desc="Light but not extremely pale" setter={setDp} />
        <Opt group={dp} val="medium" label="Medium" desc="Moderate depth, tans well" setter={setDp} />
        <Opt group={dp} val="deep" label="Deep" desc="Rich, deep melanin, rarely burns" setter={setDp} />
      </div>
      {ut && dp && <button onClick={() => onDone(ut,dp)} style={{ width:"100%", padding:"14px", borderRadius:100, border:"none", background:"#1a1410", color:"#faf6f1", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>See My Results →</button>}
    </div>
  );
}

function UndertoneScreen({ undertone, depth, aiReason, onNext }) {
  const d = UNDERTONE_DATA[undertone]; const c = d.color;
  return (
    <div>
      <SectionTitle icon="🔬" title="Your Undertone" step={2} total={8} />
      {aiReason && <div style={{ background:"#f5f5ff", border:"1px solid #c8c8f0", borderRadius:10, padding:"12px 16px", marginBottom:16, fontSize:12, color:"#5050a0", fontStyle:"italic", lineHeight:1.6 }}>AI reading: {aiReason}</div>}
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 18px", background:c+"12", border:`1.5px solid ${c}`, borderRadius:12, marginBottom:16 }}>
        <div style={{ width:36, height:36, borderRadius:"50%", background:d.swatch, border:`2px solid ${c}`, flexShrink:0 }} />
        <div>
          <p style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:c, marginBottom:2 }}>Detected undertone</p>
          <p style={{ fontFamily:"'Playfair Display', serif", fontSize:22, color:"#1a1410" }}>{d.label}</p>
        </div>
      </div>
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>What this means</p>
        <p style={{ fontSize:13, lineHeight:1.7, color:"#2a2018" }}>{d.description}</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
        {[["Vein color",d.vein],["Skin cast",d.cast],["Jewelry",d.jewelry],["Sun behavior",d.sun]].map(([label,val]) => (
          <div key={label} style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"12px 14px" }}>
            <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#9a8878", marginBottom:4 }}>{label}</p>
            <p style={{ fontSize:12, color:"#2a2018", lineHeight:1.5 }}>{val}</p>
          </div>
        ))}
      </div>
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"14px 16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:6 }}>Your depth</p>
        <Tag color={c}>{depth.charAt(0).toUpperCase()+depth.slice(1)}</Tag>
        <p style={{ fontSize:13, color:"#5a5048", marginTop:8, lineHeight:1.6 }}>This tells us how light or dark your base products need to be. Combined with your undertone it pinpoints your exact shade range.</p>
      </div>
      <AvoidBox text={d.avoid} />
      <NextBtn label="Foundation Guide →" onClick={onNext} />
    </div>
  );
}

function FoundationScreen({ undertone, depth, onNext }) {
  const fd = FOUNDATION_DATA[undertone]; const dd = fd.depth_ranges[depth]; const c = UNDERTONE_DATA[undertone].color;
  const uLetter = undertone==="cool"?"C":undertone==="warm"?"W":"N";
  return (
    <div>
      <SectionTitle icon="🏛️" title="Foundation" step={3} total={8} />
      <div style={{ background:c+"12", border:`1.5px solid ${c}`, borderRadius:12, padding:"18px", marginBottom:16 }}>
        <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:c, marginBottom:6 }}>Your shade range</p>
        <p style={{ fontFamily:"'Playfair Display', serif", fontSize:28, fontWeight:500, color:"#1a1410", marginBottom:10 }}>{dd.range}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{dd.keywords.map(k=><Tag key={k} color={c}>{k}</Tag>)}</div>
      </div>
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>How to decode shade names</p>
        <p style={{ fontSize:13, lineHeight:1.7, color:"#2a2018" }}>Look for the letter <strong style={{ color:c }}>{uLetter}</strong> after the number — this is the undertone code. Examples: <strong>15{uLetter}</strong>, <strong>21{uLetter}</strong>. No letter? Look for keywords like <strong>{dd.keywords[0]}</strong>.</p>
      </div>
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>Why this range works for you</p>
        <p style={{ fontSize:13, lineHeight:1.7, color:"#2a2018" }}>{dd.reason}</p>
      </div>
      <AvoidBox text="Avoid shades labeled warm, golden, honey, or peachy if you're cool-toned — they create a mismatched mask effect." />
      <div style={{ marginTop:16 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:12 }}>Shop by budget</p>
        <BrandTabs brands={fd.brands} color={c} />
      </div>
      <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:10 }}>
        <ProTip text={fd.pro_tip} />
        <BrushTip text={fd.brush_tip} />
      </div>
      <NextBtn label="Concealer Guide →" onClick={onNext} />
    </div>
  );
}

function ConcealerScreen({ undertone, onNext }) {
  const data = CONCEALER_DATA[undertone]; const c = UNDERTONE_DATA[undertone].color;
  const [open, setOpen] = useState(0);
  return (
    <div>
      <SectionTitle icon="🎭" title="Concealer" step={4} total={8} />
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
        <p style={{ fontSize:13, color:"#5a5048", lineHeight:1.7 }}>Concealer isn't one-size-fits-all. The shade depends on <strong>what you're covering</strong> — tap each concern below.</p>
      </div>
      {data.purpose_map.map((item,i) => (
        <div key={item.concern} style={{ marginBottom:10, border:"1px solid #e8e0d4", borderRadius:12, overflow:"hidden" }}>
          <button onClick={() => setOpen(open===i?-1:i)} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", background:open===i?c+"10":"#faf6f1", border:"none", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:item.hex, border:"1.5px solid #d8cfc4", flexShrink:0 }} />
              <span style={{ fontSize:14, fontWeight:500, color:"#1a1410" }}>{item.concern}</span>
            </div>
            <span style={{ fontSize:16, color:"#9a8878", display:"inline-block", transform:open===i?"rotate(180deg)":"none", transition:"0.2s" }}>▾</span>
          </button>
          {open===i && (
            <div style={{ padding:"0 16px 16px", borderTop:"1px solid #e8e0d4" }}>
              <div style={{ background:c+"10", border:`1px solid ${c}30`, borderRadius:8, padding:"10px 14px", margin:"14px 0 12px" }}>
                <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:c, marginBottom:4 }}>Shade to use</p>
                <p style={{ fontSize:13, fontWeight:500, color:"#1a1410" }}>{item.shade}</p>
              </div>
              <p style={{ fontSize:13, lineHeight:1.7, color:"#2a2018", marginBottom:12 }}>{item.why}</p>
              <p style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>Recommended products</p>
              {item.products.map(p => (
                <div key={p} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:c, flexShrink:0 }} />
                  <span style={{ fontSize:12, color:"#2a2018" }}>{p}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:10 }}>
        <ProTip text={data.pro_tip} />
        <BrushTip text={data.brush_tip} />
      </div>
      <NextBtn label="Blush Education →" onClick={onNext} />
    </div>
  );
}

function BlushEduScreen({ undertone, onNext }) {
  const c = UNDERTONE_DATA[undertone].color;
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <SectionTitle icon="🌸" title="What Blush Colors Do" step={5} total={8} />
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
        <p style={{ fontSize:13, color:"#5a5048", lineHeight:1.7 }}>Most people pick blush by what looks pretty in the pan — but the color you see is not the color it creates on your skin. Tap each shade to learn what it actually does.</p>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16 }}>
        {BLUSH_EDU.map((item,i) => (
          <button key={item.color} onClick={() => setSelected(selected===i?null:i)} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 14px", borderRadius:100, border:`1.5px solid ${selected===i?item.hex:"#e8e0d4"}`, background:selected===i?item.hex+"20":"#faf6f1", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
            <span style={{ width:14, height:14, borderRadius:"50%", background:item.hex, flexShrink:0 }} />
            <span style={{ fontSize:12, fontWeight:500, color:"#1a1410" }}>{item.color}</span>
          </button>
        ))}
      </div>
      {selected!==null && (() => {
        const item = BLUSH_EDU[selected]; const works = item.works_for.includes(undertone);
        return (
          <div style={{ border:`1.5px solid ${item.hex}`, borderRadius:14, overflow:"hidden", marginBottom:16, animation:"fadeIn 0.2s ease" }}>
            <div style={{ background:item.hex+"20", padding:"16px 18px", display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:40, height:40, borderRadius:"50%", background:item.hex, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:"'Playfair Display', serif", fontSize:18, color:"#1a1410" }}>{item.color}</p>
                <p style={{ fontSize:12, color:"#7a6b5d" }}>{item.effect}</p>
              </div>
              <div style={{ padding:"4px 12px", borderRadius:100, background:works?"#e0f5e0":"#ffe0e0", border:`1px solid ${works?"#80c080":"#f08080"}` }}>
                <span style={{ fontSize:11, fontWeight:600, color:works?"#307030":"#c03030" }}>{works?"✓ Works for you":"✗ Not for you"}</span>
              </div>
            </div>
            <div style={{ padding:"16px 18px" }}>
              <p style={{ fontSize:13, lineHeight:1.75, color:"#2a2018", marginBottom:10 }}>{item.why}</p>
              <p style={{ fontSize:12, color:works?"#307030":"#c03030", fontWeight:500 }}>{works?`Best for: ${item.skin_types}`:`Avoid on: ${item.avoid_on}`}</p>
            </div>
          </div>
        );
      })()}
      <BrushTip text={BLUSH_BRUSH_TIP} />
      <NextBtn label="My Blush Picks →" onClick={onNext} />
    </div>
  );
}

function BlushPicksScreen({ undertone, depth, onNext }) {
  const rec = BLUSH_RECS[undertone][depth]; const brands = BLUSH_BRANDS[undertone]; const c = UNDERTONE_DATA[undertone].color;
  return (
    <div>
      <SectionTitle icon="🌸" title="Your Blush Shades" step={6} total={8} />
      <div style={{ background:c+"12", border:`1.5px solid ${c}`, borderRadius:12, padding:"18px", marginBottom:16 }}>
        <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:c, marginBottom:8 }}>Your blush palette</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{rec.top.map(s=><Tag key={s} color={c}>{s}</Tag>)}</div>
      </div>
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>Why these work for your skin</p>
        <p style={{ fontSize:13, lineHeight:1.7, color:"#2a2018" }}>{rec.why}</p>
      </div>
      <div style={{ marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:12 }}>Shop by budget</p>
        <BrandTabs brands={brands} color={c} />
      </div>
      <BrushTip text={BLUSH_BRUSH_TIP} />
      <NextBtn label="Bronzer Guide →" onClick={onNext} />
    </div>
  );
}

function BronzerScreen({ undertone, onNext }) {
  const data = BRONZER_DATA[undertone]; const c = UNDERTONE_DATA[undertone].color;
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div>
      <SectionTitle icon="☀️" title="Bronzer" step={7} total={8} />

      {/* What does bronzer actually do — education first */}
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>What bronzer actually does</p>
        <p style={{ fontSize:13, color:"#2a2018", lineHeight:1.7 }}>Bronzer <strong>adds warmth and depth</strong> to the face — it mimics where the sun naturally hits (temples, cheekbones, jawline). Done right it looks like a real tan. Done wrong it looks like a muddy mask. The finish type matters as much as the shade.</p>
      </div>

      {/* Bronzer type education - tappable */}
      <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:10 }}>Tap a bronzer type to learn what it does</p>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
        {BRONZER_EDU.map((item, i) => (
          <div key={item.type} style={{ border:`1.5px solid ${selectedType===i?item.hex:"#e8e0d4"}`, borderRadius:12, overflow:"hidden" }}>
            <button onClick={() => setSelectedType(selectedType===i?null:i)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:selectedType===i?item.hex+"15":"#faf6f1", border:"none", cursor:"pointer", fontFamily:"'DM Sans', sans-serif", textAlign:"left" }}>
              <div style={{ width:22, height:22, borderRadius:"50%", background:item.hex, flexShrink:0 }} />
              <span style={{ fontSize:14, fontWeight:500, color:"#1a1410", flex:1 }}>{item.type}</span>
              <span style={{ fontSize:12, color:"#9a8878" }}>{selectedType===i?"▲":"▼"}</span>
            </button>
            {selectedType===i && (
              <div style={{ padding:"0 16px 14px", borderTop:`1px solid ${item.hex}40`, animation:"fadeIn 0.2s ease" }}>
                <p style={{ fontSize:13, color:"#2a2018", lineHeight:1.7, marginTop:12, marginBottom:8 }}>{item.what}</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div style={{ background:"#f0faf5", borderRadius:8, padding:"10px 12px" }}>
                    <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#307050", marginBottom:4 }}>Best for</p>
                    <p style={{ fontSize:12, color:"#2a2018", lineHeight:1.5 }}>{item.best_for}</p>
                  </div>
                  <div style={{ background:"#fff5f5", borderRadius:8, padding:"10px 12px" }}>
                    <p style={{ fontSize:10, letterSpacing:"0.15em", textTransform:"uppercase", color:"#b05050", marginBottom:4 }}>Avoid if</p>
                    <p style={{ fontSize:12, color:"#2a2018", lineHeight:1.5 }}>{item.avoid}</p>
                  </div>
                </div>
                <p style={{ fontSize:11, color:"#9a8878", marginTop:8, fontStyle:"italic" }}>When: {item.when_to_use}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Personal shade recommendation */}
      <div style={{ background:c+"12", border:`1.5px solid ${c}`, borderRadius:12, padding:"18px", marginBottom:12 }}>
        <p style={{ fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:c, marginBottom:8 }}>Your bronzer tones</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{data.shades.map(s=><Tag key={s} color={c}>{s}</Tag>)}</div>
      </div>
      <div style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:10, padding:"16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:8 }}>Why these work — and others don't</p>
        <p style={{ fontSize:13, lineHeight:1.7, color:"#2a2018" }}>{data.why}</p>
      </div>
      <AvoidBox text={`Avoid: ${data.avoid}`} />
      <div style={{ margin:"16px 0 12px" }}>
        <p style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", marginBottom:12 }}>Shop by budget</p>
        <BrandTabs brands={data.picks} color={c} />
      </div>
      <div style={{ background:"#fff8ee", border:"1px solid #e8c87a", borderRadius:10, padding:"12px 16px", marginBottom:12 }}>
        <p style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#7a5a10", marginBottom:6 }}>Application</p>
        <p style={{ fontSize:13, color:"#5a4010", lineHeight:1.65 }}>{data.application}</p>
      </div>
      <BrushTip text={data.brush_tip} />
      <NextBtn label="See Full Summary →" onClick={onNext} />
    </div>
  );
}

function Summary({ undertone, depth, onReset, onSave, isSaved }) {
  const ut = UNDERTONE_DATA[undertone]; const c = ut.color;
  const fd = FOUNDATION_DATA[undertone]; const dd = fd.depth_ranges[depth];
  const bl = BLUSH_RECS[undertone][depth]; const br = BRONZER_DATA[undertone]; const con = CONCEALER_DATA[undertone];

  const cards = [
    { icon:"🏛️", title:"Foundation", shades:dd.keywords, picks:fd.brands.luxury.slice(0,2), note:`Look for shade code "${undertone==="cool"?"C":undertone==="warm"?"W":"N"}" after the number` },
    { icon:"🎭", title:"Concealer", shades:[con.purpose_map[0].shade.split(",")[0],con.purpose_map[2].shade.split(",")[0]], picks:[con.purpose_map[0].products[0],con.purpose_map[2].products[0]], note:"Match undertone — never use warm concealer on cool skin" },
    { icon:"🌸", title:"Blush", shades:bl.top, picks:BLUSH_BRANDS[undertone].luxury.slice(0,2), note:bl.why.split(".")[0] },
    { icon:"☀️", title:"Bronzer", shades:br.shades.slice(0,3), picks:br.picks.luxury.slice(0,2), note:br.application }
  ];

  return (
    <div>
      <div style={{ textAlign:"center", marginBottom:24 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 18px", borderRadius:100, background:c+"15", border:`1.5px solid ${c}`, marginBottom:10 }}>
          <span style={{ color:c }}>✦</span>
          <span style={{ fontSize:13, fontWeight:500, color:c }}>{ut.label} Undertone · {depth.charAt(0).toUpperCase()+depth.slice(1)} Depth</span>
        </div>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:26, fontWeight:400, color:"#1a1410", marginBottom:16 }}>Your Complete Face Map</h2>

        {/* Save / saved button */}
        <button onClick={onSave} style={{
          display:"inline-flex", alignItems:"center", gap:8, padding:"10px 24px", borderRadius:100,
          border:`1.5px solid ${isSaved?"#80c080":c}`,
          background:isSaved?"#e0f5e0":c+"15",
          color:isSaved?"#307030":c, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif"
        }}>
          {isSaved ? "✓ Profile Saved" : "💾 Save This Profile"}
        </button>
      </div>

      {cards.map(({ icon, title, shades, picks, note }) => (
        <div key={title} style={{ background:"#faf6f1", border:"1px solid #e8e0d4", borderRadius:12, padding:"16px 18px", marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <span style={{ fontSize:18 }}>{icon}</span>
            <span style={{ fontFamily:"'Playfair Display', serif", fontSize:18, fontWeight:400, color:"#1a1410" }}>{title}</span>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>{shades.map(s=><Tag key={s} color={c}>{s}</Tag>)}</div>
          {picks.map(p => (
            <div key={p} style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:c, flexShrink:0 }} />
              <span style={{ fontSize:12, color:"#2a2018" }}>{p}</span>
            </div>
          ))}
          <p style={{ fontSize:11, color:"#9a8878", marginTop:8, fontStyle:"italic", lineHeight:1.5 }}>{note}</p>
        </div>
      ))}

      <BrandSearch undertone={undertone} depth={depth} />

      <EyeshadowFeature undertone={undertone} depth={depth} />

      <div style={{ display:"flex", gap:10, marginTop:20 }}>
        <button onClick={onReset} style={{ flex:1, padding:"13px", borderRadius:100, border:"1.5px solid #d8cfc4", background:"transparent", fontSize:13, color:"#7a6b5d", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>← Start Over</button>
        <button onClick={onSave} style={{ flex:1, padding:"13px", borderRadius:100, border:`1.5px solid ${c}`, background:c+"15", fontSize:13, color:c, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
          {isSaved ? "✓ Saved" : "💾 Save Profile"}
        </button>
      </div>
    </div>
  );
}

// ─── APP ROOT ──────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState("welcome");
  const [undertone, setUndertone] = useState(null);
  const [depth, setDepth] = useState(null);
  const [aiReason, setAiReason] = useState("");
  const [imgPreview, setImgPreview] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { setProfiles(loadProfiles()); }, []);

  const stepOrder = ["welcome","capture","undertone","foundation","concealer","blush_edu","blush_picks","bronzer","summary"];
  const stepNum = stepOrder.indexOf(step);
  const progress = stepNum <= 0 ? 0 : Math.round((stepNum / (stepOrder.length - 1)) * 100);
  const showProgress = !["welcome","analyzing","manual","saved"].includes(step);

  const analyze = useCallback(async (file, preview) => {
    setImgPreview(preview); setStep("analyzing");
    try {
      const base64 = await new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:[
          { type:"image", source:{ type:"base64", media_type:file.type||"image/jpeg", data:base64 } },
          { type:"text", text:`Expert makeup artist. Analyze skin photo. cool=blue/purple veins+pink cast, neutral=blue-green veins+balanced, warm=green veins+golden/peachy. fair=very pale, light=light not pale, medium=moderate, deep=rich deep melanin. JSON only no markdown: {"undertone":"cool","depth":"fair","brief_reason":"one sentence"}` }
        ]}]})
      });
      const d = await resp.json();
      const txt = d.content.map(i=>i.text||"").join("").replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(txt);
      setUndertone(parsed.undertone); setDepth(parsed.depth); setAiReason(parsed.brief_reason); setIsSaved(false); setStep("undertone");
    } catch { setStep("manual"); }
  }, []);

  const handleSave = () => {
    if (!undertone || !depth) return;
    const profile = { id: `${undertone}_${depth}_${Date.now()}`, undertone, depth, savedAt: new Date().toISOString() };
    const updated = saveProfile(profile);
    setProfiles(updated); setIsSaved(true);
  };

  const handleLoadProfile = (p: any) => {
    setUndertone(p.undertone); setDepth(p.depth); setAiReason(""); setIsSaved(true); setStep("summary");
  };

  const handleDeleteProfile = (id: any) => {
    const updated = deleteProfile(id);
    setProfiles(updated);
  };

  const reset = () => {
    setStep("welcome"); setUndertone(null); setDepth(null); setAiReason(""); setImgPreview(null); setIsSaved(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:"#faf6f1", fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        body { background:#faf6f1; }
        button { transition:all 0.15s; }
        button:hover { opacity:0.85; }
        input:focus { outline:none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ background:"#fff9f4", borderBottom:"1px solid #e8e0d4", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ flex:1 }} />
        <div style={{ textAlign:"center" }}>
          <p style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:400, letterSpacing:"0.1em", color:"#1a1410" }}>TEINTE</p>
          <p style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"#9a8878", marginTop:2 }}>AI Beauty Advisor</p>
        </div>
        <div style={{ flex:1, display:"flex", justifyContent:"flex-end" }}>
          {profiles.length > 0 && step !== "saved" && (
            <button onClick={() => setStep("saved")} style={{ background:"none", border:"1.5px solid #e8e0d4", borderRadius:100, padding:"6px 14px", fontSize:12, color:"#9a8878", cursor:"pointer", fontFamily:"'DM Sans', sans-serif" }}>
              📋 {profiles.length}
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div style={{ padding:"10px 24px 0", maxWidth:520, margin:"0 auto" }}>
          <div style={{ height:2, background:"#e8e0d4", borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`, background:"#c4956a", borderRadius:2, transition:"width 0.4s ease" }} />
          </div>
          <p style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#9a8878", textAlign:"right", marginTop:4 }}>{progress}% complete</p>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth:520, margin:"0 auto", padding:"24px 20px 60px" }}>
        {step==="welcome" && <Welcome onStart={()=>setStep("capture")} onViewSaved={()=>setStep("saved")} savedCount={profiles.length} />}
        {step==="saved" && <SavedProfiles profiles={profiles} onLoad={handleLoadProfile} onDelete={handleDeleteProfile} onBack={()=>setStep("welcome")} />}
        {step==="capture" && <Capture onAnalyze={analyze} onManual={()=>setStep("manual")} />}
        {step==="analyzing" && <Analyzing preview={imgPreview} />}
        {step==="manual" && <Manual onDone={(ut: any,dp: any)=>{setUndertone(ut);setDepth(dp);setIsSaved(false);setStep("undertone");}} />}
        {step==="undertone" && undertone && depth && <UndertoneScreen undertone={undertone} depth={depth} aiReason={aiReason} onNext={()=>setStep("foundation")} />}
        {step==="foundation" && undertone && depth && <FoundationScreen undertone={undertone} depth={depth} onNext={()=>setStep("concealer")} />}
        {step==="concealer" && undertone && <ConcealerScreen undertone={undertone} onNext={()=>setStep("blush_edu")} />}
        {step==="blush_edu" && undertone && <BlushEduScreen undertone={undertone} onNext={()=>setStep("blush_picks")} />}
        {step==="blush_picks" && undertone && depth && <BlushPicksScreen undertone={undertone} depth={depth} onNext={()=>setStep("bronzer")} />}
        {step==="bronzer" && undertone && <BronzerScreen undertone={undertone} onNext={()=>setStep("summary")} />}
        {step==="summary" && undertone && depth && <Summary undertone={undertone} depth={depth} onReset={reset} onSave={handleSave} isSaved={isSaved} />}
      </div>
    </div>
  );
}
