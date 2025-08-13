import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Hyperspeed from "../components/ui/Hyperspeed";
import CountUp from "../components/ui/CountUp";
import SplitText from "../components/ui/SplitText";

const MainPage = () => {
  const [isEmail, setIsEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setIsEmail(email);
    }
  }, [isEmail]);

  const handleButtonClick = () => {
    if (isEmail) {
      navigate("/upload");
    } else {
      navigate("/signup");
    }
  };

  return (
    <>
      <div className="relative overflow-hidden bg-white">
        {/* Hyperspeed black background section */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-black">
            <Hyperspeed
              effectOptions={{
                distortion: "turbulentDistortion",
                length: 400,
                roadWidth: 12,
                islandWidth: 2,
                lanesPerRoad: 4,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.8,
                totalSideLightSticks: 50,
                lightPairsPerRoadWay: 50,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.2, 0.6],
                lightStickHeight: [1.5, 2.0],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.05, 400 * 0.25],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x050505,
                  islandColor: 0x080808,
                  background: 0x000000,
                  shoulderLines: 0xffffff,
                  brokenLines: 0xffffff,
                  leftCars: [0xff00ff, 0xff33cc, 0xff66ff],
                  rightCars: [0x00ffff, 0x33ccff, 0x66ffff],
                  sticks: 0x00ffff,
                },
              }}
            />
          </div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10">
          <Navbar />

          {/* Dark transparent background for content */}
          <div className="bg-black/50 min-h-screen text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
              <div className="text-center space-y-8">
                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  <SplitText
                    text="Product Transparency With AI"
                    className="text-5xl md:text-6xl font-bold tracking-tight"
                    delay={100}
                    duration={0.6}
                    ease="power3.out"
                    splitType="chars"
                    from={{ opacity: 0, y: 40 }}
                    to={{ opacity: 1, y: 0 }}
                    threshold={0.1}
                    rootMargin="-100px"
                    textAlign="center"
                  />
                  <span className="block mt-2 text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent pb-1">
                    Made Simple, Smart Reporting
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="max-w-2xl mx-auto text-xl text-gray-200">
                  Create comprehensive product reports with our multi-step form,
                  conditional logic, and automatic PDF generation powered by AI.
                </p>

                {/* CTA button */}

                <div className="mt-10">
                  <button
                    onClick={handleButtonClick}
                    className="relative font-extrabold text-xl tracking-wide bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-500 active:from-purple-700 active:via-pink-700 active:to-red-700 text-white px-10 py-6 rounded-full shadow-lg hover:shadow-2xl active:shadow-md transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 hover:scale-[1.05] active:scale-[0.98]"
                  >
                    Add New Product
                  </button>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 text-center">
                  <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-red-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                    <div className="text-4xl font-bold text-purple-400">
                      <CountUp
                        from={0}
                        to={10}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                      {`+`}
                    </div>
                    <div className="text-gray-300 mt-1">Dynamic Fields</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                    <div className="text-4xl font-bold text-green-400">
                      <CountUp
                        from={0}
                        to={3}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                      {`+`}
                    </div>
                    <div className="text-gray-300 mt-1">Form Steps</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-purple-500/20 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                    <div className="text-4xl font-bold text-cyan-400">
                      <CountUp
                        from={0}
                        to={24}
                        separator=","
                        direction="up"
                        duration={1}
                        className="count-up-text"
                      />
                      {`h`}
                    </div>

                    <div className="text-gray-300 mt-1">AI Processing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;
