// Footer.js

import '../assets/Footer.css';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">ParkingLocation</div>
          <ul className="footer-links">
            <li><a href="/home">Home</a></li>
            <li><a href="/ContactUs">contactanos</a></li>
            <li><a href="/dashboard">Login</a></li>
            <li><a href="/signup">Registro</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contactanos</h4>
          <p>Email: info@yourcompany.com</p>
          <p>Phone: +57 3148448534</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="footer-social">
            <a href="#facebook">Facebook</a>
            <a href="#twitter">Twitter</a>
            <a href="#linkedin">LinkedIn</a>
            <a href="#instagram">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
