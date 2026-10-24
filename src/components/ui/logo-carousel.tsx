"use client"

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type SVGProps,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

// Define the structure for our logo objects
export interface Logo {
  name: string
  id: number
  img: React.ComponentType<{ className?: string }>
  href?: string
}

// Utility function to randomly shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Utility function to distribute logos across multiple columns
const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  const shuffled = shuffleArray(allLogos)
  const columns: Logo[][] = Array.from({ length: columnCount }, () => [])

  // Distribute logos evenly across columns
  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo)
  })

  // Ensure all columns have the same number of logos by filling shorter columns
  const maxLength = Math.max(...columns.map((col) => col.length))
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(Math.random() * shuffled.length)])
    }
  })

  return columns
}

// Props for the LogoColumn component
interface LogoColumnProps {
  logos: Logo[]
  index: number
  currentTime: number
}

// LogoColumn component: Displays a single column of animated logos
const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime }) => {
    const cycleInterval = 2000 // Time each logo is displayed (in milliseconds)
    const columnDelay = index * 200 // Stagger the start of each column's animation
    // Calculate which logo should be displayed based on the current time
    const adjustedTime =
      (currentTime + columnDelay) % (cycleInterval * logos.length)
    const currentIndex = Math.floor(adjustedTime / cycleInterval)

    const currentLogoObj = logos[currentIndex]

    // Memoize the current logo component
    const CurrentLogo = useMemo(
      () => currentLogoObj.img,
      [currentLogoObj]
    )

    return (
      // Framer Motion component for the column container
      <motion.div
        className="relative h-16 w-28 overflow-hidden sm:h-20 sm:w-36 md:h-24 md:w-48"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentLogoObj.id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            initial={{ y: "10%", opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: "-20%",
              opacity: 0,
              filter: "blur(6px)",
              transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.3,
              },
            }}
          >
            {currentLogoObj.href ? (
              <Link
                href={currentLogoObj.href}
                className="group flex h-full w-full items-center justify-center p-1 transition-transform duration-200 hover:scale-105"
                title={`Explore ${currentLogoObj.name}`}
              >
                <CurrentLogo className="h-14 max-h-[80%] w-24 max-w-[80%] object-contain md:h-20 md:w-36 transition-opacity group-hover:opacity-80" />
              </Link>
            ) : (
              <CurrentLogo className="h-14 max-h-[80%] w-24 max-w-[80%] object-contain md:h-20 md:w-36" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    )
  }
)

LogoColumn.displayName = "LogoColumn"

// 1. Jeevanam Official Logo
function JeevanamLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center h-full w-full ${className || ""}`}>
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white shadow-xs border border-red-100 p-1">
        <Image
          src="/clubs/jeevanam.jpg"
          alt="Jeevanam Blood Donation Club"
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
    </div>
  )
}

// 2. Praanah Official Logo
function PraanahLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center h-full w-full ${className || ""}`}>
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white shadow-xs border border-amber-100 p-1">
        <Image
          src="/clubs/praanah.jpg"
          alt="Praanah Arts Club"
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
    </div>
  )
}

// 3. Godha Official Logo
function GodhaLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center h-full w-full ${className || ""}`}>
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white shadow-xs border border-emerald-100 p-1">
        <Image
          src="/clubs/godha.png"
          alt="Godha Sports Club"
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
    </div>
  )
}

// 4. Ocha Official Logo
function OchaLogo({ className }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center h-full w-full ${className || ""}`}>
      <div className="relative h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden bg-white shadow-xs border border-violet-100 p-1">
        <Image
          src="/clubs/ocha.png"
          alt="Ocha Literary Club"
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
    </div>
  )
}

// Typography / Brand Badges for smooth alternating columns
function JeevanamBadge({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className || ""}`}>
      <span className="text-xl sm:text-2xl font-black tracking-tight text-red-600 font-display">
        ജീവനം
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Jeevanam Club
      </span>
    </div>
  )
}

function PraanahBadge({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className || ""}`}>
      <span className="text-xl sm:text-2xl font-black tracking-tight text-amber-600 font-display">
        പ്രാണഃ
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Praanah Arts
      </span>
    </div>
  )
}

function GodhaBadge({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className || ""}`}>
      <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600 font-display">
        ഗോദ
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Godha Sports
      </span>
    </div>
  )
}

function OchaBadge({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className || ""}`}>
      <span className="text-xl sm:text-2xl font-black tracking-tight text-violet-600 font-display">
        ഒച്ച
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Ocha Literary
      </span>
    </div>
  )
}

// Brand SVGs matching Cult UI demo
function AppleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="209"
      height="256"
      viewBox="0 0 814 1000"
      className="fill-current text-slate-900 dark:text-white"
      {...props}
    >
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
    </svg>
  )
}

function VercelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 256 222"
      width="256"
      height="222"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid"
      className="fill-current text-slate-900 dark:text-white"
      {...props}
    >
      <path d="m128 0 128 221.705H0z" />
    </svg>
  )
}

function NextjsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={180}
      height={180}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={90} cy={90} r={87} fill="black" stroke="white" strokeWidth={6} />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="white"
      />
      <rect x={115} y={54} width={12} height={72} fill="white" />
    </svg>
  )
}

function TailwindCSSIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 54 33"
      {...props}
    >
      <path
        fill="#38bdf8"
        fillRule="evenodd"
        d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

// Main LogoCarousel component
export function LogoCarousel({ columnCount = 2 }: { columnCount?: number }) {
  const [logoSets, setLogoSets] = useState<Logo[][]>([])
  const [currentTime, setCurrentTime] = useState(0)

  // Memoize all logos: 4 authentic club logos, 4 Malayalam brand marks, and tech icons
  const allLogos: Logo[] = useMemo(
    () => [
      { name: "Jeevanam (Blood Donation)", id: 1, img: JeevanamLogo, href: "/clubs/jeevanam" },
      { name: "Praanah (Arts Club)", id: 2, img: PraanahLogo, href: "/clubs/praanah" },
      { name: "Godha (Sports Club)", id: 3, img: GodhaLogo, href: "/clubs/godha" },
      { name: "Ocha (Literary Club)", id: 4, img: OchaLogo, href: "/clubs/ocha" },
      { name: "ജീവനം Blood Wing", id: 5, img: JeevanamBadge, href: "/clubs/jeevanam" },
      { name: "പ്രാണഃ Arts Wing", id: 6, img: PraanahBadge, href: "/clubs/praanah" },
      { name: "ഗോദ Sports Council", id: 7, img: GodhaBadge, href: "/clubs/godha" },
      { name: "ഒച്ച Literary Forum", id: 8, img: OchaBadge, href: "/clubs/ocha" },
      { name: "Apple", id: 9, img: AppleIcon },
      { name: "Vercel", id: 10, img: VercelIcon },
      { name: "Nextjs", id: 11, img: NextjsIcon },
      { name: "Tailwind", id: 12, img: TailwindCSSIcon },
    ],
    []
  )

  // Distribute logos across columns when the component mounts
  useEffect(() => {
    const distributedLogos = distributeLogos(allLogos, columnCount)
    setLogoSets(distributedLogos)
  }, [allLogos, columnCount])

  // Function to update the current time (used for logo cycling)
  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100)
  }, [])

  // Set up an interval to update the time every 100ms
  useEffect(() => {
    const intervalId = setInterval(updateTime, 100)
    return () => clearInterval(intervalId)
  }, [updateTime])

  // Render the logo columns matching Cult UI
  return (
    <div className="flex space-x-6 sm:space-x-8 md:space-x-12 items-center justify-center">
      {logoSets.map((logos, index) => (
        <LogoColumn
          key={index}
          logos={logos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  )
}

export default LogoCarousel
