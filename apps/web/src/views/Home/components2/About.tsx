import React from 'react';

const PageFeature = () => {
  const items = [
    {
      id: 1,
      imageUrl: 'https://cdn4.iconfinder.com/data/icons/3d-web-3-0-illustrations/512/Decentralized_Exchange_DEX.png', // Ganti dengan URL gambar Anda
      title: 'Title 1',
      description: 'This is the description for item 1',
    },
    {
      id: 2,
      imageUrl: 'https://cdn4.iconfinder.com/data/icons/3d-web-3-0-illustrations/512/Decentralized_Exchange_DEX.png',
      title: 'Title 2',
      description: 'This is the description for item 2',
    },
    {
      id: 3,
      imageUrl: 'https://cdn4.iconfinder.com/data/icons/3d-web-3-0-illustrations/512/Decentralized_Exchange_DEX.png',
      title: 'Title 3',
      description: 'This is the description for item 3',
    },
    {
      id: 4,
      imageUrl: 'https://cdn4.iconfinder.com/data/icons/3d-web-3-0-illustrations/512/Decentralized_Exchange_DEX.png',
      title: 'Title 4',
      description: 'This is the description for item 4',
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4" style={{borderRadius: '20px 10px 20px 10px'}}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg"
            style={{border: '10px solid #4ade80', borderRadius: '50px 20px 20px 20px'}}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-20 object-cover px-2 bg-[#4ade80]"
              style={{border: '10px solid #4ade80', borderRadius: '30px 0px 30px 0px'}}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageFeature;
