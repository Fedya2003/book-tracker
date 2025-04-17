// 'use client'

// import {
// 	Sheet,
// 	SheetContent,
// 	SheetDescription,
// 	SheetHeader,
// 	SheetTitle,
// 	SheetTrigger,
// } from '@/components/ui/sheet'
// import { cn } from '@/lib/utils'
// import { Menu } from 'lucide-react'
// import Link from 'next/link'
// import { usePathname } from 'next/navigation'

// function Mobile() {
// 	const pathname = usePathname()

// 	return (
// 		<Sheet>
// 			<SheetTrigger className='flex md:hidden'>
// 				<Menu />
// 			</SheetTrigger>
// 			<SheetContent>
// 				<SheetHeader>
// 					<SheetTitle>
// 						<Link href={'/'} className='font-oswald text-4xl'>
// 							Yangiliklar
// 						</Link>
// 					</SheetTitle>
// 					<div className='flex flex-col space-y-3'>
// 						{navLinks.map(nav => (
// 							<Link
// 								href={nav.route}
// 								key={nav.route}
// 								className={cn(
// 									'hover:bg-blue-400/20 py-1 px-3 cursor-pointer rounded-sm transition-colors',
// 									pathname === nav.route && 'text-blue-400'
// 								)}
// 							>
// 								{nav.name}
// 							</Link>
// 						))}
// 					</div>
// 					<SheetDescription></SheetDescription>
// 				</SheetHeader>
// 			</SheetContent>
// 		</Sheet>
// 	)
// }

// export default Mobile
