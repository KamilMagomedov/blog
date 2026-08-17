import { lora } from "@/styles/fonts";
import { ICategory } from "@/types/Travel";

interface ICategoriesProps {
  categories: ICategory[] | null;
}

const Categories: React.FC<ICategoriesProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="w-full min-w-0">
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
              <p className="flex items-center justify-between text-black">
                <span>{category.title}</span>

                <span className="font-black text-[#575557]">
                  ({category.posts_count ?? 0})
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
