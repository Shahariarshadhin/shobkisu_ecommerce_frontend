import Image from 'next/image'

const LandingHero = () => {
    return (
        <div className='container mx-auto'>
            <div className='grid grid-cols-3 gap-3 w-full h-[600px]'>
                <div className='w-full h-full col-span-2  rounded-lg'>
                    <Image className='w-full h-[616px]  rounded-lg' src="/assets/Home/banner.png" alt="hero" width={1000} height={500} />
                </div>
                <div className='w-full h-[600px] flex flex-col gap-3 rounded-lg'>
                    <Image className='w-full h-[300px] rounded-lg' src="/assets/Home/banner2.png" alt="hero" width={1000} height={500} />
                    <Image className='w-full h-[300px] rounded-lg' src="/assets/Home/banner3.png" alt="hero" width={1000} height={500} />
                </div>
            </div>
        </div>
    )
}

export default LandingHero
