import "../styles/Info.css";
import bgImage from "../assets/bg1.jpg";

function Info() {
  return (
    <section className="info-section container-fluid">
      <div className="row info-wrapper">
        <div className="col-lg-8 col-md-12 image-container">
          <div className="bg__image">
            <img src={bgImage} alt="Dexter Leather" className="bg-image-styled" />
          </div>
        </div>
        <div className="col-lg-4 col-md-12 d-flex align-items-center justify-content-center">
          <div className="info-content text-center">
            <h2 className="info-title animate-title">Crafted with Purpose. Worn with Pride.</h2>
            <p className="info-description animate-fade">
              At <strong>Dexter Leather</strong>, we handcraft premium leather goods that fuse timeless design with modern durability.
            </p>
            <p className="info-description animate-fade">
              Every detail — from stitch to finish — reflects our dedication to quality, style, and legacy.
            </p>
            <p className="info-description animate-fade">
              <em>Designed in Britain. Built to endure. Worn to inspire.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Info;
