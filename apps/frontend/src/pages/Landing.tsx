import { AnimatedCard } from "../components/LandingPage/3dcard"
import { Features } from "../components/LandingPage/Features"
import { Hero } from "../components/LandingPage/Hero"
import { Start } from "../components/LandingPage/Start"
import { UseCase } from "../components/LandingPage/useCase"

export const Landing = () => {
    return (
        <div className="bg-black min-h-screen w-full">
            <Hero />
            <AnimatedCard />
            <Features />
            <UseCase />
            <Start />
        </div>
    )
}