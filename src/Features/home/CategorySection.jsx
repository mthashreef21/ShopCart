import { Link } from "react-router-dom";

const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    name: "Fashion",
    slug: "fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
    bg: "bg-pink-50",
  },
  {
    id: 3,
    name: "Home & Living",
    slug: "home-living",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
    bg: "bg-amber-50",
  },
  {
    id: 4,
    name: "Beauty",
    slug: "beauty",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
    bg: "bg-rose-50",
  },
  {
    id: 5,
    name: "Sports",
    slug: "sports",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80",
    bg: "bg-cyan-50",
  },
  {
    id: 6,
    name: "Toys & Games",
    slug: "toys-games",
    image:
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&w=400&q=80",
    bg: "bg-yellow-50",
  },
  {
    id: 7,
    name: "Groceries",
    slug: "groceries",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    bg: "bg-green-50",
  },
  {
    id: 8,
    name: "Books",
    slug: "books",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80",
    bg: "bg-violet-50",
  },
];

function CategorySection() {
  return (
    <section className="mx-auto w-[90%] py-8 sm:py-10">
      {/* Section Heading */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Shop by Category
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Explore products across your favourite categories
          </p>
        </div>

        <Link
          to="/shop"
          className="text-sm font-semibold text-violet-600 transition hover:text-violet-800"
        >
          View All →
        </Link>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/shop?category=${category.slug}`}
            className="group min-w-0 text-center"
            aria-label={`Shop ${category.name}`}
          >
            {/* Category Image */}
            <div
              className={`relative aspect-square overflow-hidden rounded-2xl ${category.bg} transition duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/50" />

              {/* Category Name */}
              <div className="absolute inset-0 flex items-center justify-center p-2">
                <h3 className="text-xs font-bold text-white drop-shadow-lg sm:text-sm lg:text-base">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategorySection;