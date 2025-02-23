const LagrgeScreenOnly = () => {
  return (
    <div className="absolute top-0 left-0 h-[100vh] w-full bg-background z-20 md:hidden flex flex-col items-center justify-center text-muted-foreground">
      <div className="w-[40%]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 40"
          x="0px"
          y="0px"
          fill="currentColor"
        >
          <path d="M14.5,1H3.5A2.5,2.5,0,0,0,1,3.5v25A2.5,2.5,0,0,0,3.5,31h11A2.5,2.5,0,0,0,17,28.5V3.5A2.5,2.5,0,0,0,14.5,1ZM16,28.5A1.5,1.5,0,0,1,14.5,30H3.5A1.5,1.5,0,0,1,2,28.5V3.5A1.5,1.5,0,0,1,3.5,2H5v.5a.5.5,0,0,0,.5.5h7a.5.5,0,0,0,.5-.5V2h1.5A1.5,1.5,0,0,1,16,3.5Z" />
          <path d="M28.5,15H19a.5.5,0,0,0,0,1h9.5A1.5,1.5,0,0,1,30,17.5V19h-.5a.5.5,0,0,0-.5.5v7a.5.5,0,0,0,.5.5H30v1.5A1.5,1.5,0,0,1,28.5,30H18a.5.5,0,0,0,0,1H28.5A2.5,2.5,0,0,0,31,28.5v-11A2.5,2.5,0,0,0,28.5,15Z" />
          <path d="M20.1,6.8a.51.51,0,0,0,.4.2.49.49,0,0,0,.3-.1.5.5,0,0,0,.1-.7l-.79-1.06a9.45,9.45,0,0,1,7.5,6.73l-1.36-.8a.5.5,0,1,0-.5.86L27.9,13.2a.47.47,0,0,0,.25.07l.13,0a.44.44,0,0,0,.3-.23l1.27-2.15a.51.51,0,0,0-.17-.69.51.51,0,0,0-.69.18l-.51.87a10.43,10.43,0,0,0-8.19-7.07l1-.76a.5.5,0,0,0-.6-.8l-2,1.5a.5.5,0,0,0-.1.7Z" />
        </svg>
      </div>
      <p className="text-sm">Please rotate your device to view the page..</p>
    </div>
  );
};

export default LagrgeScreenOnly;
