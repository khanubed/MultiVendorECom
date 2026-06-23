import React from 'react';

const ProductCard = ({ title, price, description, imgUrl, isLarge, onAddToCart, buttonLabel = 'Add to Cart' }) => {
  if (isLarge) {
    return (
      <div className="col-span-12 lg:col-span-6 premium-card p-0 flex flex-col group overflow-hidden">
        <div className="h-80 relative overflow-hidden">
          <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={imgUrl} alt={title}/>
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-label-md font-bold">New Arrival</div>
        </div>
        <div className="p-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-headline-md font-headline-md">{title}</h3>
            <span className="text-headline-md font-headline-md text-secondary">${price}</span>
          </div>
          <p className="text-body-md text-on-surface-variant mb-lg">{description}</p>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={!onAddToCart}
            className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3 premium-card p-6 flex flex-col group">
      <div className="aspect-square rounded-xl overflow-hidden mb-md">
        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={imgUrl} alt={title}/>
      </div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-on-surface-variant text-sm mb-4">{description}</p>
      <div className="mt-auto flex justify-between items-center gap-3">
        <span className="font-bold text-secondary">${price}</span>
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!onAddToCart}
          className="p-2 border border-outline-variant rounded-full hover:bg-secondary hover:text-white transition-all disabled:opacity-50"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;