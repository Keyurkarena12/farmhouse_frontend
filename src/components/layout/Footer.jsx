// import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Company Info */}
//           <div className="col-span-1 md:col-span-2">
//             <div className="flex items-center space-x-2 mb-4">
//               <FaHome className="h-8 w-8 text-green-400" />
//               <span className="text-2xl font-bold">FarmhouseBooking</span>
//             </div>
//             <p className="text-gray-300 mb-4">
//               Discover and book the perfect farmhouse getaway. Experience nature, 
//               comfort, and unforgettable memories at our carefully selected farmhouses.
//             </p>
//             <div className="flex space-x-4">
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <FaFacebook className="h-6 w-6" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <FaTwitter className="h-6 w-6" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <FaInstagram className="h-6 w-6" />
//               </a>
//               <a href="#" className="text-gray-400 hover:text-white transition-colors">
//                 <FaLinkedin className="h-6 w-6" />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
//             <ul className="space-y-2">
//               <li>
//                 <a href="/" className="text-gray-300 hover:text-white transition-colors">
//                   Home
//                 </a>
//               </li>
//               <li>
//                 <a href="/farmhouses" className="text-gray-300 hover:text-white transition-colors">
//                   Farmhouses
//                 </a>
//               </li>
//               <li>
//                 <a href="/about" className="text-gray-300 hover:text-white transition-colors">
//                   About Us
//                 </a>
//               </li>
//               <li>
//                 <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
//                   Contact
//                 </a>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
//             <div className="space-y-3">
//               <div className="flex items-center space-x-3">
//                 <FaMapMarkerAlt className="h-5 w-5 text-green-400" />
//                 <span className="text-gray-300">
//                   123 Farmhouse Lane<br />
//                   Countryside, ST 12345
//                 </span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FaPhone className="h-5 w-5 text-green-400" />
//                 <span className="text-gray-300">+1 (555) 123-4567</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <FaEnvelope className="h-5 w-5 text-green-400" />
//                 <span className="text-gray-300">info@farmhousebooking.com</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="border-t border-gray-700 mt-8 pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm">
//               © 2024 FarmhouseBooking. All rights reserved.
//             </p>
//             <div className="flex space-x-6 mt-4 md:mt-0">
//               <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
//                 Privacy Policy
//               </a>
//               <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
//                 Terms of Service
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { useEffect, useRef } from 'react';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const balloonContainer = useRef(null);

  // Balloon animation (client-side only)
  useEffect(() => {
    const container = balloonContainer.current;
    if (!container) return;

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const balloons = [];

    const createBalloon = () => {
      const balloon = document.createElement('div');
      balloon.className = 'footer-balloon';
      balloon.style.left = `${Math.random() * 100}%`;
      balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      balloon.style.width = `${Math.random() * 20 + 30}px`;
      balloon.style.height = `${Math.random() * 20 + 40}px`;
      balloon.style.animationDuration = `${Math.random() * 8 + 10}s`;
      balloon.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(balloon);
      balloons.push(balloon);

      // Remove after animation
      setTimeout(() => {
        if (balloon.parentNode) balloon.remove();
        balloons.splice(balloons.indexOf(balloon), 1);
      }, 18000);
    };

    const interval = setInterval(createBalloon, 1500);

    return () => {
      clearInterval(interval);
      balloons.forEach(b => b.remove());
    };
  }, []);

  return (
    <footer className="relative bg-gray-800 text-white overflow-hidden">
      {/* Floating Balloons Background */}
      <div
        ref={balloonContainer}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaHome className="h-8 w-8 text-green-400" />
              <span className="text-2xl font-bold">FarmhouseBooking</span>
            </div>
            <p className="text-gray-300 mb-4">
              Discover and book the perfect farmhouse getaway. Experience nature, 
              comfort, and unforgettable memories at our carefully selected farmhouses.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/farmhouses" className="text-gray-300 hover:text-white transition-colors">
                  Farmhouses
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">
                  123 Farmhouse Lane<br />
                  Countryside, ST 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">info@farmhousebooking.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FarmhouseBooking. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Balloon Animation CSS */}
      <style jsx>{`
        @keyframes floatUp {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 0.85;
          }
          to {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
          }
        }

        .footer-balloon {
          position: absolute;
          bottom: -100px;
          border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
          animation: floatUp linear forwards;
          pointer-events: none;
          box-shadow: inset -5px -5px 10px rgba(0,0,0,0.2);
        }
      `}</style>
    </footer>
  );
};

export default Footer;