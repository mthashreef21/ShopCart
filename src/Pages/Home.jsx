import HeroBanner from "../Features/home/HeroBanner"
import BenefitsSection from "../Features/home/BenefitsSection"
import CategorySection from "../Features/home/CategorySection"
import FlashDeals from "../Features/home/FlashDeals"

function Home({ onAdd }){


    return(
        <main>
            {/* Promotional Banner */}
            <HeroBanner />

            <div className="hidden sm:block"><BenefitsSection/></div>
            

            <CategorySection/>

            <FlashDeals onAdd={onAdd}/>
        
        </main>
    )
}

export default Home