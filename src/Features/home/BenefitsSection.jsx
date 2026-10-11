import { Truck, RotateCcw, ShieldCheck, Headset } from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹499",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    id: 2,
    icon: RotateCcw,
    title: "Easy Returns",
    description: "7-day return policy",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    id: 3,
    icon: ShieldCheck,
    description: "Secure Payment",
    description: "100% secure checkout",
    iconBg: "bg-emerald-100",
    inconColor: "text-emerald-600",
  },
  {
    id: 4,
    icon: Headset,
    title: "24/7 Support",
    description: "Here to help you",
    iconBg: "bg-orange-100",
  },
];

function BenefitsSection() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.id}
              className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50"
            >
              {/* Icon */}
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${benefit.iconBg} transition duration-300 group-hover:scale-110`}
              >
                <Icon
                  size={27}
                  strokeWidth={1.8}
                  className={benefit.iconColor}
                />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {benefit.title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export default BenefitsSection;
