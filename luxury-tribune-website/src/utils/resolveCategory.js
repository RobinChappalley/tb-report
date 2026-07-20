import { find, propEq } from 'ramda';

const ResolveCategory = categories => {
  const category =
    categories.find(
      cat =>
        Array.isArray(cat?.ancestors?.nodes) || cat?.ancestors?.nodes === null
    ) || find(propEq(null, 'ancestors'), categories);

  return category;
};
export default ResolveCategory;
