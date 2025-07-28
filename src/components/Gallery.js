import React, { useState } from 'react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/esq090118groening001-el3-1534352997.jpg?crop=1xw:0.9998524420835178xh;center,top&resize=980:*",
      alt: "Matt Groening with Simpsons characters",
      title: "Matt Groening and The Simpsons",
      description: "The creator with his most iconic characters"
    },
    {
      id: 2,
      src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Matt_Groening_2010.jpg/800px-Matt_Groening_2010.jpg",
      alt: "Matt Groening portrait",
      title: "Matt Groening Portrait",
      description: "The man behind the cartoons"
    },
    {
      id: 3,
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/The_Simpsons_Season_1_DVD.jpg/220px-The_Simpsons_Season_1_DVD.jpg",
      alt: "The Simpsons Season 1",
      title: "The Simpsons",
      description: "The longest-running American animated series"
    },
    {
      id: 4,
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Futurama_Season_1_DVD.jpg/220px-Futurama_Season_1_DVD.jpg",
      alt: "Futurama Season 1",
      title: "Futurama",
      description: "A sci-fi comedy set in the year 3000"
    },
    {
      id: 5,
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Disenchantment_Season_1_Poster.jpg/220px-Disenchantment_Season_1_Poster.jpg",
      alt: "Disenchantment Season 1",
      title: "Disenchantment",
      description: "A fantasy comedy series on Netflix"
    },
    {
      id: 6,
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/The_Simpsons_Season_2_DVD.jpg/220px-The_Simpsons_Season_2_DVD.jpg",
      alt: "The Simpsons Season 2",
      title: "The Simpsons Legacy",
      description: "Over 30 years of animated excellence"
    }
  ];

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <p>Visual journey through Matt Groening's creative universe</p>
      </div>

      <div className="gallery-grid">
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className="gallery-item"
            onClick={() => setSelectedImage(image)}
          >
            <div className="image-container">
              <img src={image.src} alt={image.alt} />
              <div className="image-overlay">
                <h4>{image.title}</h4>
                <p>{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <img src={selectedImage.src} alt={selectedImage.alt} />
            <div className="lightbox-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 