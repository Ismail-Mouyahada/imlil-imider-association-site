const Footer = () => {
  return (
    <footer className="bg-foreground/5 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            جمعية إمليل للتنمية والتعاون
          </h3>
          <p className="text-muted-foreground">
            دوار أيت سعيد أوداود -   إميضر
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
