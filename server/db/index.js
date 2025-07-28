const client = require('./client')
const path = require('path')
const fs = require('fs')
const { createUser } = require('./user')
const { createShoe } = require('./shoes')
const { createFavorite } = require('./favorites')

const seed = async () => {
  const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS user_shoes;
    DROP TABLE IF EXISTS shoes;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100),
      is_Oauth Boolean DEFAULT false,
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
    );
  `;
  await client.query(SQL);

  const [andy1, kev1324, thjnhlai1308, shoequeen, flykickz, stealthstep, kimmy_shoez, jessica_93x, emily_lacesup, drethecollector] = await Promise.all ([
    createUser({ username: 'andy1', password: 'andy_pass', is_admin: false }),
    createUser({ username: 'kev1324', password: 'kevpass4321', is_admin: false }),
    createUser({ username: 'thjnhlai1308', password: 'thjnhlai1234', is_admin: true }),
    createUser({ username: 'shoequeen', password: 'queen123', is_admin: false }),
    createUser({ username: 'flykickz', password: 'flyhigh2025', is_admin: false }),
    createUser({ username: 'stealthstep', password: 'ghostmode', is_admin: false }),
    createUser({ username: 'jessica_93x', password: 'shoes123', is_admin: false }),
    createUser({ username: 'kimmy_shoez', password: 'kimmy123', is_admin: false }),
    createUser({ username: 'emily_lacesup', password: 'emily123', is_admin: false }),
    createUser({ username: 'drethecollector', password: 'dre123', is_admin: false })
  ])

  const sneakerData = [
    {
      name: 'Silver Bullet',
      brand: 'Nike',
      model: 'Air Max 97',
      color: 'Silver',
      image_url: 'https://i.ebayimg.com/images/g/gtUAAOSwOppi8CaH/s-l1200.jpg',
      description: 'The Nike Air Max 97 "Silver Bullet" revives a cult classic with its signature reflective waves, metallic silver upper, and bold red Swoosh.',
      buy_link: 'https://stockx.com/nike-air-max-97-og-silver-bullet-2022'
    },
    {
      name: 'Panda Dunk',
      brand: 'Nike',
      model: 'Dunk Low Retro',
      color: 'Black/White',
      image_url: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-White-Black-2021-Product.jpg',
      description: 'The ultimate go-to everyday sneaker with crisp black and white contrast.',
      buy_link: 'https://stockx.com/nike-dunk-low-retro-white-black-2021'
    },
    {
      name: 'Ultraboost 22',
      brand: 'Adidas',
      model: 'Ultraboost',
      color: 'Black',
      image_url: 'https://www.kratzsports.biz/cdn/shop/products/GX3062.jpg?v=1645049766',
      description: 'Unmatched comfort with Boost cushioning and Primeknit fit.',
      buy_link: 'https://www.goat.com/sneakers/ultraboost-22-black-white-gx3062?srsltid=AfmBOorNbYWvlEWRDizQO7wqO6_wcBaBlvzKHCghKtUlx20Ee1zEJLfozbs'
    },
    {
      name: 'New Balance 574',
      brand: 'New Balance',
      model: '574',
      color: 'Gray',
      image_url: 'https://gazellesports.com/cdn/shop/files/ml574evg_2_d0f48f97-a740-441e-aa46-d7b0709e37f9.jpg',
      description: 'The classic silhouette that blends comfort and vintage style.',
      buy_link: 'https://www.newbalance.com/pd/574/ML574.html'
    },
    {
      name: 'Chuck 70 High',
      brand: 'Converse',
      model: 'Chuck Taylor',
      color: 'White',
      image_url: 'https://i.ebayimg.com/images/g/~Q0AAOSwFZ1j0cQF/s-l1200.jpg',
      description: 'A modern update to the timeless canvas sneaker, with a retro touch.',
      buy_link: 'https://www.converse.com/shop/p/chuck-70-unisex-high-top-shoe/162050C.html'
    },
    {
      name: 'Yeezy Boost 350 V2',
      brand: 'Adidas',
      model: '350 V2',
      color: 'Zebra',
      image_url: 'https://images.stockx.com/images/adidas-Yeezy-Boost-350-V2-Zebra-Product.jpg',
      description: 'The “Zebra” Yeezy combines bold black/white striping with Boost comfort.',
      buy_link: 'https://stockx.com/adidas-yeezy-boost-350-v2-zebra'
    },
    {
      name: 'Jordan 1 Retro High',
      brand: 'Jordan',
      model: 'Retro 1',
      color: 'Chicago',
      image_url: 'https://images.stockx.com/images/Air-Jordan-1-Retro-Chicago-2015-Product_V2.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'The “Lost & Found” AJ1 brings back the legendary Chicago colorway with vintage flair.',
      buy_link: 'https://stockx.com/air-jordan-1-retro-high-og-chicago-lost-and-found'
    },
    {
      name: 'Vans Old Skool',
      brand: 'Vans',
      model: 'Old Skool',
      color: 'Black/White',
      image_url: 'https://www.shopwss.com/cdn/shop/files/VN000ZDF1WX_1.jpg?v=1715299379',
      description: 'A skate icon featuring the classic side stripe and low-top silhouette.',
      buy_link: 'https://www.vans.com/en-us/shoes-c00081/old-skool-shoe-pvn000d3hy28'
    },
    {
      name: 'Air Force 1 Low',
      brand: 'Nike',
      model: 'Air Force 1',
      color: 'White',
      image_url: 'https://www.shopwss.com/cdn/shop/files/CW2288111_1.jpg?crop=center&height=1000&v=1743015639&width=1000',
      description: 'An all-time classic, clean and timeless for every fit.',
      buy_link: 'https://www.nike.com/t/air-force-1-07-mens-shoes-jBrhbr'
    },
    {
      name: 'NB 327',
      brand: 'New Balance',
      model: '327',
      color: 'Navy',
      image_url: 'https://image-raw.reversible.com/raw_images/daef814808ce714916b9963440833aaf0384501eb72b8312e17a7d02948c1abe',
      description: 'Bold 70s-inspired silhouette with a modern twist and oversized N logo.',
      buy_link: 'https://stockx.com/new-balance-327-natural-indigo-white?country=US&currencyCode=USD&size=8.5&size-conversion=us+m&g_acctid=709-098-4271&g_adgroupid=168762683236&g_adid=716598480198&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Mid+CM+-+%28US%29+New+Customer&g_campaignid=21802225654&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2353445434716&g_merchantid=111829866&g_network=g&g_partition=2353445434716&g_productchannel=online&g_productid=330d0063-9072-4327-95cb-850f2a3f76ee&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_midcm_(us)newcustomer&utm_campaignid=21802225654&content=716598480198&keyword=&gad_source=1&gad_campaignid=21802225654&gbraid=0AAAAADePu3CZnUXyekZQJDSFA3YiV3oaF&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKKDno5lMy8N4siJovnalJoz89vDhn8F565xjE1kbFAgYmwpT02BEZBoCL_wQAvD_BwE'
    },
    {
      name: 'Gel-Lyte III',
      brand: 'Asics',
      model: 'Gel-Lyte',
      color: 'Orange',
      image_url: 'https://images.stockx.com/images/Asics-Gel-Lyte-III-Afew-X-Beams-Orange-Koi-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358',
      description: 'Split tongue, street style, and signature Gel cushioning — a cult classic.',
      buy_link: 'https://stockx.com/asics-gel-lyte-iii-afew-x-beams-orange-koi'
    },
    {
      name: 'Reebok Club C 85',
      brand: 'Reebok',
      model: 'Club C 85',
      color: 'White/Green',
      image_url: 'https://cdn.shopify.com/s/files/1/0862/7834/0912/files/100000155_SLC_eCom-tif.png?v=1734089202',
      description: 'Clean tennis vibes with vintage edge — perfect for casual fits.',
      buy_link: 'https://www.reebok.com/products/reebok-club-c-85-shoes-white-green-100050?srsltid=AfmBOorBmxfFDjMXA6z_01YpB5nENl0Qa9xLhQfEbPIwLbo4w_4JUvIs'
    },
    {
      name: 'Air Max Plus',
      brand: 'Nike',
      model: 'Tn',
      color: 'Sunset',
      image_url: 'https://cdn.flightclub.com/TEMPLATE/806001/1.jpg?w=3840',
      description: 'A bold gradient and Tuned Air units define this high-energy silhouette.',
      buy_link: 'https://stockx.com/nike-air-max-plus-sunset-2024?country=US&currencyCode=USD&size=8.5&size-conversion=us+m&g_acctid=709-098-4271&g_adgroupid=168762683436&g_adid=716598480189&g_adtype=pla&g_campaign=OD+-+Sneakers+-+Low+CM+-+%28US%29+New+Customer&g_campaignid=21802225651&g_ifcreative=&g_ifproduct=product&g_keyword=&g_keywordid=pla-2351567718230&g_merchantid=111829866&g_network=g&g_partition=2351567718230&g_productchannel=online&g_productid=37a1653f-d2dd-417a-ae58-5a60733fcf44&gclsrc=aw.ds&&utm_source=google&utm_medium=cpc&utm_campaign=od_sneakers_lowcm_(us)newcustomer&utm_campaignid=21802225651&content=716598480189&keyword=&gad_source=1&gad_campaignid=21802225651&gbraid=0AAAAADePu3Bx6g7dD3_FRx5xvvZe8XkXz&gclid=CjwKCAjwv5zEBhBwEiwAOg2YKMvdyGrYGeys7VWMHdJsp7Su0xOnG6O8YNqLNs8-5jt1o_oph4eEYhoCancQAvD_BwE'
    },
    {
      name: 'Nike Dunk Low “UNC”',
      brand: 'Nike',
      model: 'Dunk Low',
      color: 'University Blue/White',
      image_url: 'https://images.stockx.com/images/Nike-Dunk-Low-Retro-UNC-2021-Product.jpg',
      description: 'A fan favorite college colorway, the UNC Dunk Low combines clean white leather with baby blue overlays for a sharp, timeless style.',
      buy_link: 'https://stockx.com/nike-dunk-low-retro-unc-2021'
    },
    {
      name: 'Adidas Samba OG',
      brand: 'Adidas',
      model: 'Samba OG',
      color: 'Black/White/Gum',
      image_url: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/7d63a3a203b34b42979fadb60042cc9e_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg',
      description: 'Classic indoor soccer turned lifestyle icon. The Samba OG features smooth leather and a durable gum sole.',
      buy_link: 'https://www.adidas.com/us/samba-og-shoes/B75807.html'
    },
    {
      name: 'Nike SB Dunk Low “Ben & Jerry’s Chunky Dunky”',
      brand: 'Nike SB',
      model: 'Dunk Low',
      color: 'Multi-Color',
      image_url: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Ben-Jerrys-Chunky-Dunky-Product.jpg',
      description: 'The most playful collab in sneaker history. Chunky Dunky features melting swooshes, cow-print overlays, and Ben & Jerry’s branding.',
      buy_link: 'https://stockx.com/nike-sb-dunk-low-ben-jerrys-chunky-dunky'
    },
    {
      name: 'Air Jordan 4 “Thunder” (2023)',
      brand: 'Jordan',
      model: 'Retro 4',
      color: 'Black/Tour Yellow',
      image_url: 'https://images.stockx.com/images/Air-Jordan-4-Retro-Thunder-2023-Product.jpg',
      description: 'Back in black and yellow, the 2023 “Thunder” AJ4 blends bold colors with legendary Tinker Hatfield design.',
      buy_link: 'https://stockx.com/air-jordan-4-retro-thunder-2023'
    },
    {
      name: 'New Balance 2002R “Protection Pack - Rain Cloud”',
      brand: 'New Balance',
      model: '2002R',
      color: 'Gray',
      image_url: 'https://images.stockx.com/images/New-Balance-2002R-Protection-Pack-Rain-Cloud-Product.jpg',
      description: 'Layered suede, deconstructed vibes, and tonal perfection. A must-have for NB fans.',
      buy_link: 'https://stockx.com/new-balance-2002r-protection-pack-rain-cloud'
    },
    {
      name: 'Nike Air Max 1 “Anniversary Red”',
      brand: 'Nike',
      model: 'Air Max 1',
      color: 'White/University Red',
      image_url: 'https://images.stockx.com/images/Nike-Air-Max-1-Anniversary-Red-2017-Product.jpg',
      description: 'The OG that started it all. The Air Max 1 “Anniversary Red” returns with visible Air and Tinker’s vision.',
      buy_link: 'https://stockx.com/nike-air-max-1-anniversary-red-2017'
    },
    {
      name: 'Reebok Question Mid “OG Red Toe”',
      brand: 'Reebok',
      model: 'Question Mid',
      color: 'White/Red',
      image_url: 'https://images.stockx.com/images/Reebok-Question-Mid-OG-Red-Toe-2020-Product.jpg',
      description: 'Allen Iverson’s debut shoe in its most iconic form — red toe suede and all.',
      buy_link: 'https://stockx.com/reebok-question-mid-og-red-toe-2020'
    },
    {
      name: 'Nike Air Max 90 “Infrared”',
      brand: 'Nike',
      model: 'Air Max 90',
      color: 'White/Grey/Infrared',
      image_url: 'https://images.stockx.com/images/Nike-Air-Max-90-Infrared-2020-Product.jpg',
      description: 'Timeless design and bold color blocking define this Air Max classic.',
      buy_link: 'https://stockx.com/nike-air-max-90-infrared-2020'
    },
    {
      name: 'Converse Run Star Hike',
      brand: 'Converse',
      model: 'Run Star Hike',
      color: 'Black/White',
      image_url: 'https://images.converse.com/is/image/converse/M9160C_A_107X1.jpg',
      description: 'Elevated style with chunky platform and jagged outsole. Classic Converse with modern edge.',
      buy_link: 'https://www.converse.com/shop/p/run-star-hike-unisex-high-top-shoe/M9160C.html'
    },
    {
      name: 'Asics Gel-Kayano 14 “Cream/Black”',
      brand: 'Asics',
      model: 'Gel-Kayano 14',
      color: 'Cream/Black',
      image_url: 'https://images.stockx.com/images/Asics-Gel-Kayano-14-Cream-Black-Product.jpg',
      description: 'A Y2K retro runner with street style edge. Gel-Kayano 14 is back and better.',
      buy_link: 'https://stockx.com/asics-gel-kayano-14-cream-black'
    },
    {
      name: 'Nike Air Max 270',
      brand: 'Nike',
      model: 'Air Max 270',
      color: 'Black/White',
      image_url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/pmk4kwsn5z0aegcijbxe/air-max-270-mens-shoes-KkLcGR.png',
      description: 'The Air Max 270 features a bold heel bubble and breathable mesh for all-day comfort and street-ready style.',
      buy_link: 'https://www.nike.com/t/air-max-270-mens-shoes-KkLcGR'
    },
    {
      name: 'Jordan 11 Retro “Cool Grey”',
      brand: 'Jordan',
      model: 'Retro 11',
      color: 'Cool Grey',
      image_url: 'https://images.stockx.com/images/Air-Jordan-11-Retro-Cool-Grey-2021-Product.jpg',
      description: 'An iconic release with patent leather and plush nubuck in a sleek cool grey finish.',
      buy_link: 'https://stockx.com/air-jordan-11-retro-cool-grey-2021'
    },
    {
      name: 'Nike SB Dunk Low “Raygun Tie-Dye”',
      brand: 'Nike SB',
      model: 'Dunk Low',
      color: 'Orange/Black Tie-Dye',
      image_url: 'https://images.stockx.com/images/Nike-SB-Dunk-Low-Raygun-Tie-Dye-Black-Product.jpg',
      description: 'A psychedelic take on the cult-favorite Raygun Dunks, reimagined with tie-dye and embroidered aliens.',
      buy_link: 'https://stockx.com/nike-sb-dunk-low-raygun-tie-dye-black'
    },
    {
      name: 'Adidas Forum Low “Bad Bunny”',
      brand: 'Adidas',
      model: 'Forum Low',
      color: 'Pink',
      image_url: 'https://images.stockx.com/images/adidas-Forum-Low-Bad-Bunny-Pink-Easter-Egg-Product.jpg',
      description: 'Bad Bunny’s Forum collab turns retro basketball into bold streetwear with straps and suede.',
      buy_link: 'https://stockx.com/adidas-forum-low-bad-bunny-pink-easter-egg'
    },
    {
      name: 'Nike Air Zoom Vomero 5 “Oatmeal”',
      brand: 'Nike',
      model: 'Air Zoom Vomero 5',
      color: 'Oatmeal',
      image_url: 'https://images.stockx.com/images/Nike-Zoom-Vomero-5-Oatmeal-Product.jpg',
      description: 'Tech-runner DNA meets lifestyle trends with mesh, leather overlays, and a neutral tone.',
      buy_link: 'https://stockx.com/nike-zoom-vomero-5-oatmeal'
    },
    {
      name: 'New Balance 550 “White Green”',
      brand: 'New Balance',
      model: '550',
      color: 'White/Green',
      image_url: 'https://images.stockx.com/images/New-Balance-550-White-Green-Product.jpg',
      description: 'A low-top throwback basketball sneaker with a clean color block and vintage edge.',
      buy_link: 'https://stockx.com/new-balance-550-white-green'
    },
    {
      name: 'Nike Air Huarache “Triple White”',
      brand: 'Nike',
      model: 'Air Huarache',
      color: 'White',
      image_url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/88f95b8a-60b8-46d5-81a1-e23743a4bb8a/air-huarache-shoes-KcD8rB.png',
      description: 'Comfort meets 90s heritage with the iconic neoprene inner boot and minimalist white finish.',
      buy_link: 'https://www.nike.com/t/air-huarache-shoes-KcD8rB'
    },
    {
      name: 'Salomon XT-6 “Black”',
      brand: 'Salomon',
      model: 'XT-6',
      color: 'Black',
      image_url: 'https://images.stockx.com/images/Salomon-XT-6-Black-Product.jpg',
      description: 'Built for the trail, loved by the street. The XT-6 is rugged, technical, and all-black.',
      buy_link: 'https://stockx.com/salomon-xt-6-black'
    },
    {
      name: 'Nike Air Jordan 6 “Infrared”',
      brand: 'Jordan',
      model: 'Retro 6',
      color: 'Black/Infrared',
      image_url: 'https://images.stockx.com/images/Air-Jordan-6-Retro-Black-Infrared-2019-Product.jpg',
      description: 'Michael Jordan’s 1991 championship sneaker returns with bold infrared hits and smooth nubuck.',
      buy_link: 'https://stockx.com/air-jordan-6-retro-black-infrared-2019'
    },
    {
      name: 'Nike Air Presto “Triple Black”',
      brand: 'Nike',
      model: 'Air Presto',
      color: 'Black',
      image_url: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/67e4e365-bff9-4387-b5b6-cc61fbc02173/air-presto-mens-shoes-7Xf5Wm.png',
      description: 'Stretchy, comfy, and futuristic. The Presto is known as the “t-shirt for your feet.”',
      buy_link: 'https://www.nike.com/t/air-presto-mens-shoes-7Xf5Wm'
    }
    
  ]
  
  

  const allUsers = [andy1, kev1324, thjnhlai1308, shoequeen, flykickz, stealthstep];

  for (const sneaker of sneakerData) {
    await createShoe(sneaker);
  }

  console.log("created tables and seeded data")
};

module.exports = {
  client,
  seed
};
