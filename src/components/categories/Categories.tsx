import { lora } from "@/styles/fonts";
import { ICategory } from "@/types/Travel";

interface ICategoriesProps {
  categories: ICategory[];
}
const Categories: React.FC<ICategoriesProps> = ({ categories }) => {
  return (
    <div className="mb-[40px]">
      <div className="mx-auto xs:w-[270px] md:w-[400px] 2xl:w-[270px]">
        <h3
          className={`mb-[30px] text-xl italic ${lora.className} text-[#000c]`}
        >
          Categories
        </h3>
        <ul>
          {categories.map((category) => (
            <li
              key={category.id}
              className="relative mb-[10px] border-b-[1px] border-[#dee2e6] pb-[10px]"
            >
              <p className="text-[black]">
                {category.title}
                <span className="absolute right-0 top-0 text-[#ccc]">
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
