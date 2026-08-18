import { lora } from "@/styles/fonts";
import { ICategorySummary } from "@/types/Travel";

interface ICategoriesProps {
  categories: ICategorySummary[] | null;
}

const Categories: React.FC<ICategoriesProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-[40px]">
      <div className="mx-auto w-full">
        <h3
          className={`mb-[30px] text-xl italic ${lora.className} text-[#000c]`}
        >
          Categories
        </h3>

        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              className="relative mb-[10px] border-b border-[#dee2e6] pb-[10px]"
            >
              <p className="text-black">
                {category.title}

                <span className="absolute right-0 top-0 font-black text-[#575557]">
                  ({category.posts_count})
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
