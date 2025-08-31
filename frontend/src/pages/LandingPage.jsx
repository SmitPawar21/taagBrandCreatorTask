import {useNavigate} from 'react-router-dom'

const LandingPage = () => {

    const navigate = useNavigate();

    const handleBrandBrief = () => {
        navigate('/brand-brief');
    }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] bg-[#057B51] rounded-full blur-3xl opacity-50 top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#01402F] rounded-full blur-3xl opacity-40 bottom-[-150px] right-[-150px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#001719] rounded-full blur-3xl opacity-40 top-[200px] right-[200px]"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#C5F37D] rounded-full blur-3xl opacity-30 bottom-[100px] left-[250px]"></div>
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-8xl font-bold text-white drop-shadow-md mb-10">
          Taag.one
        </h1>
        <h1 className="text-3xl font-bold text-white drop-shadow-md mb-6">
          Merging Tech, Agencies & Artists Globally
        </h1>
        <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
          TAAG is the only data-led influencer, UGC & ad agency run by engineers. We deliver measurable results throughcreative excellence for global brands.
        </p>
        <button className="px-6 py-3 rounded-2xl bg-[#C5F37D] text-black font-semibold shadow-lg hover:scale-105 transition-transform cursor-pointer" onClick={handleBrandBrief}>
          Brand Brief
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
