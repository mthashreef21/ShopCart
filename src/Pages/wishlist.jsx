import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

import { toggleWishlist } from "../Features/wishlist/wishlistSlice";
import { formatPrice, getDiscountedPrice } from "../utils/price";

function Wishlist({ onAdd }) {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const handleRemove = (product) => {
    dispatch(toggleWishlist(product));
  };

  if (wishlistItems.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] w-[90%] flex-col items-center justify-center text-center">
        <Heart size={64} className="mb-5 text-gray-300" />

        <h1 className="text-3xl font-bold text-gray-900">
          Your Wishlist Is Empty
        </h1>

        <p className="mt-3 text-gray-500">
          Save your favourite products and find them here.
        </p>

        <Link
          to="/"
          className="mt-6 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
        >
          Continue Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto min-h-[60vh] w-[90%] py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          My Wishlist
        </h1>

        <p className="mt-2 text-gray-500">
          You have saved {wishlistItems.length} product
          {wishlistItems.length !== 1 ? "s" : ""}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {wishlistItems.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <Link to={`/product/${product.id}`}>
              <div className="flex aspect-square items-center justify-center bg-gray-50 p-5">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>

            <div className="p-4">
              <h2 className="line-clamp-2 min-h-12 font-semibold text-gray-900">
                {product.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="font-bold text-gray-900">
                  {getDiscountedPrice(
                    product.price,
                    product.discountPercentage
                  )}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAdd?.(product, 1)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-700"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                type="button"
                onClick={() => handleRemove(product)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={18} />
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Wishlist;