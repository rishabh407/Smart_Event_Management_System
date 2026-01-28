const PageHeader = ({ title, subtitle }) => {

 return (

  <div className="mb-6">

   <h1 className="text-2xl font-bold">
    {title}
   </h1>

   {subtitle && (
    <p className="text-gray-500">
     {subtitle}
    </p>
   )}

  </div>

 );
};

export default PageHeader;
