import { openDb } from '../src/models/db.js';

const seed = async () => {
  const db = await openDb();

  const houses = [
    {
      title: 'Modern Family House',
      price: 350000,
      description: 'A beautiful modern home with garden and pool.',
      address: '123 Main St, Springfield',
      bedrooms: 4,
      bathrooms: 2,
      total_area: 250,
      living_area: 200,
      garage: true,
      terrace: true,
      active: true,
      rentable: false,
      year_built: 2015,
      images: [
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/house1-1.jpg',
          alt: 'Front view',
          order: 1
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/house1-2.jpg',
          alt: 'Living room',
          order: 2
        }
      ]
    },
    {
      title: 'Cozy Cottage',
      price: 180000,
      description: 'Charming countryside cottage perfect for a couple.',
      address: '45 Lakeview Rd, Greenwood',
      bedrooms: 2,
      bathrooms: 1,
      total_area: 100,
      living_area: 80,
      garage: false,
      terrace: true,
      active: true,
      rentable: true,
      year_built: 1990,
      images: [
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/cottage1.jpg',
          alt: 'Front view',
          order: 1
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/cottage2.jpg',
          alt: 'Back garden',
          order: 2
        }
      ]
    },
    {
      title: 'Luxury Penthouse',
      price: 650000,
      description: 'Spacious penthouse with city views and premium amenities.',
      address: '10 Skyline Blvd, Downtown',
      bedrooms: 3,
      bathrooms: 3,
      total_area: 300,
      living_area: 270,
      garage: true,
      terrace: true,
      active: false,
      rentable: true,
      year_built: 2020,
      images: [
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/penthouse1.jpg',
          alt: 'City view',
          order: 1
        },
        {
          url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/penthouse2.jpg',
          alt: 'Kitchen and dining area',
          order: 2
        }
      ]
    }
  ];

  for (const house of houses) {
    const result = await db.run(
      `
      INSERT INTO houses (
        title, price, description, address, bedrooms, bathrooms,
        total_area, living_area, garage, terrace, active,
        rentable, year_built
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        house.title,
        house.price,
        house.description,
        house.address,
        house.bedrooms,
        house.bathrooms,
        house.total_area,
        house.living_area,
        house.garage ? 1 : 0,
        house.terrace ? 1 : 0,
        house.active ? 1 : 0,
        house.rentable ? 1 : 0,
        house.year_built
      ]
    );

    const houseId = result.lastID;

    for (const img of house.images) {
      await db.run(
        `
        INSERT INTO images (house_id, url, alt, order_index)
        VALUES (?, ?, ?, ?)
      `,
        [houseId, img.url, img.alt, img.order]
      );
    }

    console.log(`✅ Seeded house: ${house.title}`);
  }

  console.log('🌱 Seeding complete.');
};

seed().catch((err) => {
  console.error('❌ Error during seeding:', err);
});