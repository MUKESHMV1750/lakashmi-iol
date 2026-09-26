const fs = require('fs');
const path = require('path');

const clientSrc = 'c:/Users/ELCOT/Desktop/ns/oil-business-ecommerce/client/src';

const missingPages = [
  'About', 'Contact', 'PrivacyPolicy', 'Terms', 'NotFound', 
  'ResetPassword', 'OrderTracking', 'ReturnRequest', 'Profile', 'Wishlist'
];

const missingAdmin = [
  'Dashboard', 'Products', 'AddProduct', 'EditProduct', 'Categories', 
  'Orders', 'Returns', 'Customers', 'Coupons', 'BannerManagement', 
  'Reviews', 'Reports', 'Settings'
];

const createPlaceholder = (name, type) => {
  // ensure the component name is valid (e.g. BannerManagement, AddProduct)
  const componentName = name.replace(/[^a-zA-Z0-9]/g, '');
  return `const ${componentName} = () => {
  return (
    <div className="p-8 text-center text-2xl font-bold">
      ${name} ${type}
    </div>
  );
};

export default ${componentName};
`;
};

missingPages.forEach(page => {
  const dirPath = path.join(clientSrc, 'pages', page);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, 'index.jsx');
  fs.writeFileSync(filePath, createPlaceholder(page, 'Page'));
});

missingAdmin.forEach(adminPage => {
  const dirPath = path.join(clientSrc, 'admin');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const filePath = path.join(dirPath, `${adminPage}.jsx`);
  fs.writeFileSync(filePath, createPlaceholder(adminPage, 'Admin View'));
});

console.log('Successfully created missing placeholder files!');
