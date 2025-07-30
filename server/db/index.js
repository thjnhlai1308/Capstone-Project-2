const client = require('./client')
const path = require('path')
const fs = require('fs')
const { createUser } = require('./user')
const { createShoe } = require('./shoes')
const { createFavorite } = require('./favorites')
const { createReview } = require('./reviews')

const seed = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reviews;
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS user_shoes;
    DROP TABLE IF EXISTS shoes;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100),
      email VARCHAR(255),
      is_Oauth Boolean DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CHECK((password IS NOT NULL AND is_Oauth = false) OR (password IS NULL AND is_Oauth = true)),
      is_admin Boolean DEFAULT false NOT NULL 
    );

    CREATE TABLE shoes (
      id UUID PRIMARY KEY,
      brand VARCHAR(100) NOT NULL,
      model VARCHAR(100),
      color VARCHAR(50),
      name VARCHAR(100),
      image_url TEXT,
      description TEXT,
      buy_link TEXT,
      user_id UUID REFERENCES users(id)
    );

    CREATE TABLE favorites (
      id UUID PRIMARY KEY,
      shoe_id UUID REFERENCES shoes(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      CONSTRAINT shoe_and_user_id UNIQUE(shoe_id, user_id)
    );;

    CREATE TABLE reviews (
      id UUID PRIMARY KEY,
      shoe_id UUID REFERENCES shoes(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      image_urls TEXT[],
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
  await client.query(SQL)

  const [andy1, kev1324, thjnhlai1308, shoequeen, flykickz, stealthstep, kimmy_shoez, jessica_93x, emily_lacesup, drethecollector] = await Promise.all ([
    createUser({ username: 'andy1', password: 'andy_pass', email: 'andy1@gmail.com', is_admin: false }),
    createUser({ username: 'kev1324', password: 'kevpass4321', is_admin: false }),
    createUser({ username: 'thjnhlai1308', password: 'thjnhlai1234', email: 'thjnhlai1234@gmail.com', is_admin: true }),
    createUser({ username: 'shoequeen', password: 'queen123', email: 'shoequeen124@gmail.com', is_admin: false }),
    createUser({ username: 'flykickz', password: 'flyhigh2025', email: 'flykickz1234@gmail.com', is_admin: false }),
    createUser({ username: 'stealthstep', password: 'ghostmode', email: 'stealthmode4321@gmail.com', is_admin: false }),
    createUser({ username: 'jessica_93x', password: 'shoes123', email: 'jessica93@gmail.com', is_admin: false }),
    createUser({ username: 'kimmy_shoez', password: 'kimmy123', email: 'kimmy2025@gmail.com', is_admin: false }),
    createUser({ username: 'emily_lacesup', password: 'emily123', email: 'emily25@gmail.com', is_admin: false }),
    createUser({ username: 'drethecollector', password: 'dre123', email: 'drethe1324@gmail.com', is_admin: false })
  ])


  const sneakerData = [
    {
      name: 'Silver Bullet',
      brand: 'Nike',
      model: 'Air Max 97',
      color: 'Silver',
      image_url: 'https://i.ebayimg.com/images/g/gtUAAOSwOppi8CaH/s-l1200.jpg',
      description: 'The Air Max 97 "Silver Bullet" brings iconic streetwear energy with its sleek, reflective silver upper inspired by Japanese bullet trains. Featuring full-length visible Air cushioning and bold red Swoosh detailing, it’s a timeless fusion of speed and style. Perfect for turning heads on the move.',
      buy_link: 'https://stockx.com/nike-air-max-97-og-silver-bullet-2022'
    },
    {
      name: 'Panda Dunk',
      brand: 'Nike',
      model: 'Dunk Low Retro',
      color: 'Black/White',
      image_url: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg',
      description: 'The Nike Dunk Low "Panda" delivers a clean, classic look with its timeless black-and-white colorway. Its smooth leather upper and retro basketball silhouette make it a versatile staple for any sneaker rotation. Simple, bold, and always in demand.',
      buy_link: 'https://stockx.com/nike-dunk-low-retro-white-black-2021'
    },
    {
      name: 'Ultraboost 22',
      brand: 'Adidas',
      model: 'Ultraboost',
      color: 'Black',
      image_url: 'https://www.kratzsports.biz/cdn/shop/products/GX3062.jpg?v=1645049766',
      description: 'The Ultraboost 22 delivers responsive comfort with adidas signature Boost midsole and a foot-hugging Primeknit upper. Designed for everyday runs or all-day wear, it combines energy return with a smooth, adaptive fit. Sleek, stylish, and built to go the distance.',
      buy_link: 'https://www.goat.com/sneakers/ultraboost-22-black-white-gx3062?srsltid=AfmBOorNbYWvlEWRDizQO7wqO6_wcBaBlvzKHCghKtUlx20Ee1zEJLfozbs'
    },
    {
      name: 'New Balance 574',
      brand: 'New Balance',
      model: '574',
      color: 'Gray',
      image_url: 'https://gazellesports.com/cdn/shop/files/ml574evg_2_d0f48f97-a740-441e-aa46-d7b0709e37f9.jpg',
      description: 'The New Balance 574 blends retro style with everyday comfort, making it a timeless staple in any sneaker rotation. With its suede and mesh upper, ENCAP midsole cushioning, and classic silhouette, it delivers both durability and laid-back vibes. A go-to for casual wear that never goes out of style.',
      buy_link: 'https://www.newbalance.com/pd/574-core/ML574V3-40377.html'
    },
    {
      name: 'Chuck 70 High',
      brand: 'Converse',
      model: 'Chuck Taylor',
      color: 'White',
      image_url: 'https://i.ebayimg.com/images/g/~Q0AAOSwFZ1j0cQF/s-l1200.jpg',
      description: 'The Chuck 70 High reimagines the classic Converse silhouette with premium materials and enhanced comfort. Featuring a higher rubber foxing, vintage stitching, and cushioned insoles, it delivers both retro flair and everyday wearability. A timeless staple built for modern style.',
      buy_link: 'https://www.converse.com/shop/p/chuck-70-canvas-unisex-high-top-shoe/162056MP.html?pid=162056MP&dwvar_162056MP_color=white%2Fgarnet%2Fegret&dwvar_162056MP_width=standard&styleNo=162056C&pdp=true'
    },
    {
      name: 'Yeezy Boost 350 V2',
      brand: 'Adidas',
      model: '350 V2',
      color: 'Zebra',
      image_url: 'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg',
      description: 'The “Zebra” Yeezy combines bold black/wThe Yeezy Boost 350 V2 blends futuristic design with all-day comfort, featuring a Primeknit upper and signature side stripe. Its Boost cushioning delivers responsive support, while the minimalist silhouette makes it a staple for any sneaker rotation. Effortlessly cool and always in demand.hite striping with Boost comfort.',
      buy_link: 'https://stockx.com/adidas-yeezy-boost-350-v2-white-core-black-red'
    },
    {
      name: 'Jordan 1 Retro High',
      brand: 'Jordan',
      model: 'Retro 1',
      color: 'Chicago',
      image_url: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product_V2.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'The Jordan 1 Retro High is a timeless classic that blends heritage basketball style with streetwear credibility. Featuring premium leather, bold colorways, and the iconic Wings logo, it delivers both performance and cultural impact. A must-have for sneakerheads and Jordan fans alike.',
      buy_link: 'https://stockx.com/air-jordan-1-retro-high-og-chicago-reimagined-lost-and-found'
    },
    {
      name: 'Vans Old Skool',
      brand: 'Vans',
      model: 'Old Skool',
      color: 'Black/White',
      image_url: 'https://www.shopwss.com/cdn/shop/files/VN000ZDF1WX_1.jpg?v=1715299379',
      description: 'The Vans Old Skool is a timeless skate classic, known for its durable canvas and suede upper and iconic side stripe. With a low-top silhouette and padded collar, it blends comfort and style for everyday wear. A go-to for streetwear and skate culture alike.',
      buy_link: 'https://www.vans.com/en-us/shoes-c00081/old-skool-shoe-pvn000d3hy28'
    },
    {
      name: 'Air Force 1 Low',
      brand: 'Nike',
      model: 'Air Force 1',
      color: 'White',
      image_url: 'https://www.shopwss.com/cdn/shop/files/CW2288111_1.jpg?crop=center&height=1000&v=1743015639&width=1000',
      description: 'The Nike Air Force 1 Low is a timeless icon that blends street style with classic basketball heritage. With its crisp leather upper, bold silhouette, and Air cushioning, it delivers everyday comfort and undeniable swagger. A staple in sneaker culture, it’s the go-to for clean, versatile looks.',
      buy_link: 'https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr'
    },
    {
      name: 'NB 327',
      brand: 'New Balance',
      model: '327',
      color: 'Navy',
      image_url: 'https://image-raw.reversible.com/raw_images/daef814808ce714916b9963440833aaf0384501eb72b8312e17a7d02948c1abe',
      description: 'The New Balance 327 blends retro running style with modern flair, inspired by the brand’s 1970s heritage. Featuring an oversized “N” logo, lightweight suede and nylon upper, and a studded rubber outsole, it’s built for everyday comfort with a bold, street-ready look. Perfect for those who want vintage vibes with a fresh twist.',
      buy_link: 'https://stockx.com/new-balance-327-natural-indigo-white?country=US&currencyCode=USD&size=8.5&size-conversion=us+m&g_acctid=709-098-4271&g_adgroupid=168762683236&g_adid=716598480198&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Mid+CM+-+%28US%29+New+Customer&g_campaignid=21802225654&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2353445434716&g_merchantid=111829866&g_network=g&g_partition=2353445434716&g_productchannel=online&g_productid=330d0063-9072-4327-95cb-850f2a3f76ee&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_midcm_(us)newcustomer&utm_campaignid=21802225654&content=716598480198&keyword=&gad_source=1&gad_campaignid=21802225654&gbraid=0AAAAADePu3CZnUXyekZQJDSFA3YiV3oaF&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKKDno5lMy8N4siJovnalJoz89vDhn8F565xjE1kbFAgYmwpT02BEZBoCL_wQAvD_BwE'
    },
    {
      name: 'Gel-Lyte III',
      brand: 'Asics',
      model: 'Gel-Lyte',
      color: 'Orange',
      image_url: 'https://images.stockx.com/images/Asics-Gel-Lyte-III-Afew-X-Beams-Orange-Koi-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'The ASICS Gel-Lyte III is a classic runner known for its iconic split tongue design and sleek silhouette. Featuring GEL cushioning for all-day comfort and a mix of suede, mesh, or leather uppers, it blends streetwear style with retro performance roots. A go-to for sneakerheads and casual wear alike.',
      buy_link: 'https://stockx.com/asics-gel-lyte-iii-afew-x-beams-orange-koi'
    },
    {
      name: 'Reebok Club C 85',
      brand: 'Reebok',
      model: 'Club C 85',
      color: 'White/Green',
      image_url: 'https://cdn.shopify.com/s/files/1/0862/7834/0912/files/100000155_SLC_eCom-tif.png?v=1734089202',
      description: 'The ASICS Gel-Lyte III is a classic running silhouette known for its split tongue design, which provides a snug, stay-put fit. Featuring lightweight GEL cushioning and retro suede overlays, it blends performance comfort with street-ready style. Ideal for both everyday wear and sneaker collectors.',
      buy_link: 'https://www.reebok.com/products/reebok-club-c-85-shoes-white-green-100050?srsltid=AfmBOorBmxfFDjMXA6z_01YpB5nENl0Qa9xLhQfEbPIwLbo4w_4JUvIs'
    },
    {
      name: 'Air Max Plus',
      brand: 'Nike',
      model: 'Tn',
      color: 'Sunset',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/806001/1.jpg?w=3840',
      description: 'The Nike Air Max Plus, also known as the TN (Tuned Air), delivers bold style with its iconic wavy lines and striking gradient colorways. Designed for performance and streetwear alike, it features Tuned Air technology for targeted support and a responsive ride. This classic silhouette blends aggressive design with all-day comfort.',
      buy_link: 'https://stockx.com/nike-air-max-plus-sunset-2024?country=US&currencyCode=USD&size=8.5&size-conversion=us+m&g_acctid=709-098-4271&g_adgroupid=168762683436&g_adid=716598480189&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Low+CM+-+%28US%29+New+Customer&g_campaignid=21802225651&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2351567718230&g_merchantid=111829866&g_network=g&g_partition=2351567718230&g_productchannel=online&g_productid=37a1653f-d2dd-417a-ae58-5a60733fcf44&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_lowcm_(us)newcustomer&utm_campaignid=21802225651&content=716598480189&keyword=&gad_source=1&gad_campaignid=21802225651&gbraid=0AAAAADePu3Bx6g7dD3_FRx5xvvZe8XkXz&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKMvdyGrYGeys7VWMHdJsp7Su0xOnG6O8YNqLNs8-5jt1o_oph4eEYhoCancQAvD_BwE'
    },
    {
      name: 'Nike Dunk Low “UNC”',
      brand: 'Nike',
      model: 'Dunk Low',
      color: 'University Blue/White',
      image_url: 'https://images.stockx.com/images/Air-Jordan-1-Low-SB-UNC-Product.png?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'The Nike Dunk Low “UNC” pays homage to the University of North Carolina with its iconic white and Carolina Blue colorway. Featuring smooth leather overlays and classic Dunk styling, this pair delivers a clean, collegiate-inspired look that’s perfect on or off campus. A timeless silhouette that brings Tar Heel pride to your rotation.',
      buy_link: 'https://stockx.com/air-jordan-1-low-sb-unc'
    },
    {
      name: 'Adidas Samba OG',
      brand: 'Adidas',
      model: 'Samba OG',
      color: 'Black/White/Gum',
      image_url: 'https://images.stockx.com/images/adidas-Samba-Black-White-Gum-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'The Adidas Samba OG is a timeless classic, originally designed for indoor soccer and now a staple in streetwear culture. Featuring a premium leather upper, suede overlays, and the iconic T-toe design, it delivers both vintage style and everyday versatility. Whether on the pitch or pavement, the Samba keeps it effortlessly cool.',
      buy_link: 'https://www.adidas.com/us/samba-og-shoes/B75807.html'
    },
    {
      name: 'Nike SB Dunk Low “Ben & Jerry’s Chunky Dunky”',
      brand: 'Nike SB',
      model: 'Dunk Low',
      color: 'Multi-Color',
      image_url: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg',
      description: 'The Chunky Dunky is a playful collaboration between Nike SB and Ben & Jerry’s, released in May 2020, featuring a bright leather upper in sky blue and grassy green, topped with spotted pony‑hair cow-print overlays, a drippy yellow swoosh, cloud accents on the heel, and vibrant tie‑dye lining that echoes Ben & Jerry’s branding',
      buy_link: 'https://stockx.com/nike-sb-dunk-low-ben-jerrys-chunky-dunky'
    },
    {
      name: 'Air Jordan 4 “Thunder” (2023)',
      brand: 'Jordan',
      model: 'Retro 4',
      color: 'Black/Tour Yellow',
      image_url: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Thunder-2023-Product.jpg',
      description: 'The Air Jordan 4 “Thunder” (2023) revives the iconic black-and-yellow theme with a sleek black nubuck upper contrasted by vibrant Tour Yellow accents on the eyelets, quarter panel, lower tongue, and midsole, while white Jumpman branding appears on the tongue and heel',
      buy_link: 'https://stockx.com/air-jordan-4-retro-thunder-2023'
    },
    {
      name: 'New Balance 2002R “Protection Pack - Rain Cloud”',
      brand: 'New Balance',
      model: '2002R',
      color: 'Gray',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/275138/1.jpg',
      description: 'The “Rain Cloud” edition of the 2002R from New Balance’s Protection Pack features a muted grey mesh upper overlaid with jagged, raw-cut suede in tonal shades—creating a weathered, deconstructed effect enhanced by an exposed foam tongue. Underfoot, a distressed ABZORB midsole paired with an N‑ergy outsole delivers lightweight cushioning and impact protection.',
      buy_link: 'https://www.flightclub.com/2002r-protection-pack-rain-cloud-m2002rda?srsltid=AfmBOoqxR1JazHIFDIwHG-xXdi_-iVxgpfmaVx7aXCEN5CrKWRmM6Hq9'
    },
    {
      name: 'Nike Air Max 1 “Anniversary Red”',
      brand: 'Nike',
      model: 'Air Max 1',
      color: 'White/University Red',
      image_url: 'https://i.ebayimg.com/images/g/xaMAAOSwx8Bi-Ahx/s-l1200.jpg',
      description: 'The Nike Air Max 1 “Anniversary Red” brings back the iconic 1987 silhouette in its original white, red, and grey colorway. Celebrated for introducing visible Air cushioning, this timeless classic blends retro running style with everyday wearability.',
      buy_link: 'https://stockx.com/nike-air-max-1-anniversary-red-2017-restock?country=US&currencyCode=USD&size=9.5&size-conversion=us+m&gQT=2'
    },
    {
      name: 'Reebok Question Mid “OG Red Toe”',
      brand: 'Reebok',
      model: 'Question Mid',
      color: 'White/Red',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/991673/1.jpg?w=3840',
      description: 'A crisp white tumbled leather upper is accented by vibrant red suede overlays on the toe box, heel tab, eyelets, and branding—offering a bold throwback to Allen Iverson’s original 1996 signature design',
      buy_link: 'https://stockx.com/reebok-question-mid-red-toe-25th-anniversary?country=US&currencyCode=USD&size=10.5&size-conversion=us+m&gQT=2'
    },
    {
      name: 'Nike Air Max 90 “Infrared”',
      brand: 'Nike',
      model: 'Air Max 90',
      color: 'White/Grey/Infrared',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/245921/1.jpg',
      description: 'The Nike Air Max 90 “Infrared” is a timeless classic, featuring its signature bold red accents against a mix of mesh, leather, and suede. Originally released in 1990, its visible Air unit and sleek silhouette deliver both heritage style and everyday comfort. This colorway remains one of the most iconic in sneaker history.',
      buy_link: 'https://stockx.com/nike-air-max-90-infrared-2020?country=US&currencyCode=USD&size=5&size-conversion=us+m&g_acctid=709-098-4271&g_adgroupid=168762683236&g_adid=716598480198&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Mid+CM+-+%28US%29+New+Customer&g_campaignid=21802225654&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2424332676418&g_merchantid=111829866&g_network=g&g_partition=2424332676418&g_productchannel=online&g_productid=59fdf525-f313-4fd4-aba1-ff656fd9ed38&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_midcm_(us)newcustomer&utm_campaignid=21802225654&content=716598480198&keyword=&gad_source=1&gad_campaignid=21802225654&gbraid=0AAAAADePu3CeeVt26YhfWRk1IT9TuIxQX&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKCjTy1sbtz9lbfObvTp973hlmnpi5HtysB_phP_yCpL3H50o8-5eFBoCNZAQAvD_BwE'
    },
    {
      name: 'Asics Gel-Kayano 14 “Cream/Black”',
      brand: 'Asics',
      model: 'Gel-Kayano 14',
      color: 'Cream/Black',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/362976/1.jpg',
      description: 'The Cream/Black iteration of the Gel‑Kayano 14 revives a late‑2000s retro running aesthetic with a sleek cream mesh upper, contrasting black ASICS stripes, and metallic‑plum highlights. It retains Gel cushioning and a grooved rubber sole for superior comfort and a chunky, stability‑focused silhouette. ',
      buy_link: 'https://stockx.com/asics-gel-kayano-14-cream-black-metallic-plum?country=US&currencyCode=USD&size=4&size-conversion=us+m&gQT=2'
    },
    {
      name: 'Nike Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270',
      color: 'Black/White',
      image_url: 'https://academy.scene7.com/is/image/academy/21093092?$pdp-gallery-ng$',
      description: 'The Nike Air Max 270 combines modern comfort with heritage design, featuring a sleek upper and the tallest Air unit in the heel for a smooth ride. Inspired by classic Air Max models, it delivers everyday versatility with bold, street-ready style.',
      buy_link: 'https://www.nike.com/t/air-max-270-mens-shoes-KkLcGR'
    },
    {
      name: 'Jordan 11 Retro “Cool Grey”',
      brand: 'Jordan',
      model: 'Retro 11',
      color: 'Cool Grey',
      image_url: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Cool-Grey-2021-Product.jpg',
      description: 'The Jordan 11 Retro “Cool Grey” brings back a fan-favorite colorway with its signature mix of smooth nubuck and glossy patent leather in sleek shades of grey. Originally released in 2001, this classic silhouette is finished with a crisp white midsole and icy translucent outsole for timeless appeal.',
      buy_link: 'https://stockx.com/air-jordan-11-retro-cool-grey-2021'
    },
    {
      name: 'Nike SB Dunk Low “Raygun Tie-Dye”',
      brand: 'Nike SB',
      model: 'Dunk Low',
      color: 'Orange/Black Tie-Dye',
      image_url: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Raygun-Tie-Dye-Product.png?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'Black “Home” Tie‑Dye: Built on a tumbled‑leather Nike SB Dunk Low, this “Home” version features deep black overlays and a vibrant tie‑dye mix of orange and yellow across the side panels, with a small green Raygun alien embroidered on the heel and matching tie‑dye insoles as a tribute to the late Nike SB founder Sandy Bodecker',
      buy_link: 'https://stockx.com/nike-sb-dunk-low-raygun-tie-dye'
    },
    {
      name: 'Adidas Forum Low “Bad Bunny”',
      brand: 'Adidas',
      model: 'Forum Low',
      color: 'Pink',
      image_url: 'https://m.media-amazon.com/images/I/611kLgRJ+1L.jpg',
      description: 'Blending Bad Bunny’s love of coffee into the classic Forum Low Buckle silhouette, this collaboration wears a warm palette of beige, off‑white, and brown leather with oversized rope‑style laces and chunky buckle hardware embroidered with “Yo Visto Así.” Designed to feel rustic yet refined, the sneaker played a crucial role in launching the long‑term partnership between Bad Bunny and adidas.',
      buy_link: 'https://stockx.com/adidas-forum-buckle-low-white?country=US&currencyCode=USD&size=4.5&size-conversion=us+m&g_acctid=709-098-4271&g_adgroupid=168762683236&g_adid=716598480198&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Mid+CM+-+%28US%29+New+Customer&g_campaignid=21802225654&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2353151995383&g_merchantid=111829866&g_network=g&g_partition=2353151995383&g_productchannel=online&g_productid=377388e3-27d8-4f0c-bf06-034c214b0350&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_midcm_(us)newcustomer&utm_campaignid=21802225654&content=716598480198&keyword=&gad_source=1&gad_campaignid=21802225654&gbraid=0AAAAADePu3CeeVt26YhfWRk1IT9TuIxQX&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKNuwkGVlrBq_oVw72SQe_S_VSToZEu_xqGxDcfp2ZOQzNwZB8IfTOBoCxoIQAvD_BwE'
    },
    {
      name: 'Nike Air Zoom Vomero 5 “Oatmeal”',
      brand: 'Nike',
      model: 'Air Zoom Vomero 5',
      color: 'Oatmeal',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/334669/1.jpg?w=1080',
      description: 'Tech-runner DNA meets lifestyle trends with mesh, leather overlays, and a neutral tone.',
      buy_link: 'https://stockx.com/nike-zoom-vomero-5-oatmeal-w?country=US&currencyCode=USD&size=9.5W&size-conversion=us+w&g_acctid=709-098-4271&g_adgroupid=168762683236&g_adid=716598480198&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Mid+CM+-+%28US%29+New+Customer&g_campaignid=21802225654&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2418588464825&g_merchantid=111829866&g_network=g&g_partition=2418588464825&g_productchannel=online&g_productid=6f64f2ba-02d6-4fe1-80e6-f9114a7f077b&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_midcm_(us)newcustomer&utm_campaignid=21802225654&content=716598480198&keyword=&gad_source=1&gad_campaignid=21802225654&gbraid=0AAAAADePu3CeeVt26YhfWRk1IT9TuIxQX&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKJtYl827Aoo0UIxXbZesIWm-n21s94ux9OZBvMLZrpbd2v1yhkZBChoCUdUQAvD_BwE'
    },
    {
      name: 'New Balance 550 “White Green”',
      brand: 'New Balance',
      model: '550',
      color: 'White/Green',
      image_url: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg',
      description: 'This colorway combines a crisp white leather upper with light grey suede overlays on the toe and collar, anchored by bold green accents on the heel trim, tongue branding, “N” logo, and outsole for a retro yet fresh aesthetic',
      buy_link: 'https://stockx.com/new-balance-550-white-green'
    },
    {
      name: 'Nike Air Huarache “Triple White”',
      brand: 'Nike',
      model: 'Air Huarache',
      color: 'White',
      image_url: 'https://images.stockx.com/images/Nike-Air-Huarache-Run-Ultra-White-2017-Product.png?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'The Nike Air Huarache "Triple White" is a crisp all-white iteration of Nike’s iconic ‘90s silhouette, featuring a breathable mesh upper with clean leather overlays, a snug neoprene/spandex inner bootie, and the signature heel strap for support ',
      buy_link: 'https://stockx.com/nike-air-huarache-run-ultra-white-2017'
    },
    {
      name: 'Nike Air Jordan 6 “Infrared”',
      brand: 'Jordan',
      model: 'Retro 6',
      color: 'Black/Infrared',
      image_url: 'https://images.stockx.com/images/Air-Jordan-6-Retro-Black-Infrared-2019-Product.jpg',
      description: 'The Nike Air Jordan 6 “Infrared” is a legendary silhouette worn by Michael Jordan during his first NBA championship run. Featuring a sleek black nubuck upper with bold Infrared accents and a translucent outsole, this colorway perfectly blends performance and street style. Its iconic heel tab and visible Air cushioning complete the classic look.',
      buy_link: 'https://stockx.com/air-jordan-6-retro-black-infrared-2019'
    },
    {
      name: 'Nike Air Presto “Triple Black”',
      brand: 'Nike',
      model: 'Air Presto',
      color: 'Black',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/052868/1.jpg',
      description: 'The Nike Air Presto “Triple Black” is a minimalist statement piece rendered entirely in black—from the stretchy, breathable mesh upper and tonal laces to the molded midfoot cage, Phylon midsole, and rubber outsole.',
      buy_link: 'https://stockx.com/nike-air-presto-triple-black-shiny-toe?country=US&currencyCode=USD&size=14&size-conversion=us+m&gQT=2'
    }
    
  ]

  const users = [andy1, kev1324, thjnhlai1308, shoequeen, flykickz, stealthstep, kimmy_shoez, jessica_93x, emily_lacesup, drethecollector]
  const shoes = await Promise.all(sneakerData.map((s, i) => createShoe({ ...s, user_id: users[i % users.length].id })))

  const reviews = await Promise.all([
      createReview({ user_id: andy1.id, shoe_id: shoes[0].id, rating: 4, comment: `Perfect for casual wear.` }),
      createReview({ user_id: kev1324.id, shoe_id: shoes[1].id, rating: 5, comment: `Amazing comfort and style!` }),
      createReview({ user_id: thjnhlai1308.id, shoe_id: shoes[2].id, rating: 4, comment: `Great support during workouts.` }),
      createReview({ user_id: shoequeen.id, shoe_id: shoes[3].id, rating: 3, comment: `Stylish but slightly narrow fit.` }),
      createReview({ user_id: flykickz.id, shoe_id: shoes[4].id, rating: 5, comment: `Classic vibes and all-day comfort.` }),
      createReview({ user_id: stealthstep.id, shoe_id: shoes[5].id, rating: 4, comment: `Unique look and comfy Boost.` }),
      createReview({ user_id: kimmy_shoez.id, shoe_id: shoes[6].id, rating: 5, comment: `My favorite pair ever!` }),
      createReview({ user_id: jessica_93x.id, shoe_id: shoes[7].id, rating: 3, comment: `Solid build, a bit flat.` }),
      createReview({ user_id: emily_lacesup.id, shoe_id: shoes[8].id, rating: 4, comment: `Great quality and fit.` }),
      createReview({ user_id: drethecollector.id, shoe_id: shoes[9].id, rating: 5, comment: `Vintage flair, very comfy.` }),
      createReview({ user_id: andy1.id, shoe_id: shoes[10].id, rating: 4, comment: `Eye-catching design.` }),
      createReview({ user_id: kev1324.id, shoe_id: shoes[11].id, rating: 3, comment: `Decent comfort, average finish.` }),
      createReview({ user_id: thjnhlai1308.id, shoe_id: shoes[12].id, rating: 5, comment: `Wore them all day with no issue.` }),
      createReview({ user_id: shoequeen.id, shoe_id: shoes[13].id, rating: 4, comment: `Solid grip and fit.` }),
      createReview({ user_id: flykickz.id, shoe_id: shoes[14].id, rating: 5, comment: `Love the UNC colors.` }),
      createReview({ user_id: stealthstep.id, shoe_id: shoes[15].id, rating: 5, comment: `Sambas are timeless.` }),
      createReview({ user_id: kimmy_shoez.id, shoe_id: shoes[16].id, rating: 5, comment: `Chunky Dunky is iconic!` }),
      createReview({ user_id: jessica_93x.id, shoe_id: shoes[17].id, rating: 4, comment: `Thunder 4s are 🔥.` }),
      createReview({ user_id: emily_lacesup.id, shoe_id: shoes[18].id, rating: 5, comment: `Super comfy and looks wild.` }),
      createReview({ user_id: drethecollector.id, shoe_id: shoes[19].id, rating: 5, comment: `OG Red color pops.` }),
      createReview({ user_id: andy1.id, shoe_id: shoes[20].id, rating: 4, comment: `Iconic and clean.` }),
      createReview({ user_id: kev1324.id, shoe_id: shoes[21].id, rating: 3, comment: `Nice shape, just not for me.` }),
      createReview({ user_id: thjnhlai1308.id, shoe_id: shoes[22].id, rating: 5, comment: `Jordan 11s hit every time.` }),
      createReview({ user_id: shoequeen.id, shoe_id: shoes[23].id, rating: 4, comment: `Love the tie-dye.` }),
      createReview({ user_id: flykickz.id, shoe_id: shoes[24].id, rating: 4, comment: `Cool collab, soft leather.` }),
      createReview({ user_id: stealthstep.id, shoe_id: shoes[25].id, rating: 5, comment: `Retro runner heaven.` }),
      createReview({ user_id: kimmy_shoez.id, shoe_id: shoes[26].id, rating: 4, comment: `Classic AM90 look.` }),
      createReview({ user_id: jessica_93x.id, shoe_id: shoes[27].id, rating: 5, comment: `Best Kayano colorway.` }),
      createReview({ user_id: emily_lacesup.id, shoe_id: shoes[28].id, rating: 4, comment: `Great heel support.` }),
      createReview({ user_id: drethecollector.id, shoe_id: shoes[29].id, rating: 5, comment: `Huaraches still bangin'.` }),
      createReview({ user_id: andy1.id, shoe_id: shoes[30].id, rating: 4, comment: `Breaks in nicely after a few wears.` }),
      createReview({ user_id: thjnhlai1308.id, shoe_id: shoes[2].id, rating: 3, comment: `Solid daily wear but nothing standout.` }),
      createReview({ user_id: shoequeen.id, shoe_id: shoes[3].id, rating: 5, comment: `The design on these is next level.` }),
      createReview({ user_id: flykickz.id, shoe_id: shoes[4].id, rating: 2, comment: `Not as comfy as expected. Looks cool tho.` }),
      createReview({ user_id: stealthstep.id, shoe_id: shoes[5].id, rating: 4, comment: `Sleek and supportive, great for walks.` }),
      createReview({ user_id: kimmy_shoez.id, shoe_id: shoes[6].id, rating: 5, comment: `One of my all-time favorites. Love them!` }),
      createReview({ user_id: jessica_93x.id, shoe_id: shoes[7].id, rating: 3, comment: `Colorway is 🔥 but fit is snug.` }),
      createReview({ user_id: emily_lacesup.id, shoe_id: shoes[8].id, rating: 4, comment: `Good grip and breathable upper.` }),
      createReview({ user_id: drethecollector.id, shoe_id: shoes[9].id, rating: 5, comment: `A must-have in any collection.` }),
      createReview({ user_id: andy1.id, shoe_id: shoes[10].id, rating: 4, comment: `Clean design and solid materials.` }),
      createReview({ user_id: kev1324.id, shoe_id: shoes[11].id, rating: 5, comment: `Wearing these to the ground. Love 'em!` }),
      createReview({ user_id: thjnhlai1308.id, shoe_id: shoes[12].id, rating: 3, comment: `Good value for the price.` }),
      createReview({ user_id: shoequeen.id, shoe_id: shoes[13].id, rating: 5, comment: `These go with everything.` }),
      createReview({ user_id: flykickz.id, shoe_id: shoes[14].id, rating: 4, comment: `Built like a tank and still stylish.` }),
      createReview({ user_id: stealthstep.id, shoe_id: shoes[15].id, rating: 5, comment: `Crazy details on the upper.` }),
      createReview({ user_id: kimmy_shoez.id, shoe_id: shoes[16].id, rating: 4, comment: `Lightweight and really responsive.` }),
      createReview({ user_id: jessica_93x.id, shoe_id: shoes[17].id, rating: 3, comment: `Decent, but not worth resale.` }),
      createReview({ user_id: emily_lacesup.id, shoe_id: shoes[18].id, rating: 5, comment: `Always get compliments in these.` }),
      createReview({ user_id: drethecollector.id, shoe_id: shoes[19].id, rating: 5, comment: `Super fresh retro vibes.` }),
    ])

  const allUsers = [andy1, kev1324, thjnhlai1308, shoequeen, flykickz, stealthstep]

  for (const sneaker of sneakerData) {
    await createShoe(sneaker)
  }

  console.log("created tables and seeded data")
}

module.exports = {
  client,
  seed
}
