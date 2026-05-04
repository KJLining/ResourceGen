import CvSULogo from '../assets/cvsulogo.png'
export default function Topbar() {
    return (
        <>
        <nav className="w-full bg-neutral-400 border-b-neutral-800 fixed top-0 left-0 p-1 z-10">
            <div className="inline-flex items-center">
                <img src={CvSULogo} alt="CvSU Logo" className="w-10 h-10 mr-2" />
                <p className=' text-white font-light'>RESOURCE GENERATION</p>
            </div>
        </nav>
        </>
    )
}