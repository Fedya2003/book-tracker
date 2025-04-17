'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

function ModeToggle() {
	const [mounted, setMounted] = useState(false)
	const { setTheme, resolvedTheme } = useTheme()

	// O‘rnatish uchun faqat bir marta yuklanish
	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null  // componentni initial renderda ko‘rsatmaslik

	// UI logic
	return resolvedTheme === 'dark' ? (
		<Button
			size="icon"
			variant="ghost"
			onClick={() => setTheme('light')}
			className="text-yellow-400 hover:bg-yellow-200 transition-all"
		>
			<Sun />
		</Button>
	) : (
		<Button
			size="icon"
			variant="ghost"
			onClick={() => setTheme('dark')}
			className="text-gray-600 hover:bg-gray-200 transition-all"
		>
			<Moon />
		</Button>
	)
}

export default ModeToggle
