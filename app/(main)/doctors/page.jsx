import { Card, CardContent } from '@/components/ui/card'
import { SPECIALTIES } from '@/lib/specialities'
import Link from 'next/link'
import React from 'react'

const SpecialityPage = () => {
  return (
    <>
    <div className='flex flex-col items-center justify-center mb-8 text-center mt-12'>
        <h1 className='text-3xl font-bold text-white mb-2 '>Find your Doctor</h1>
        <p className='text-muted-foreground text-lg'>Browse by speciality or view all available healthcare provider</p>
    </div>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {SPECIALTIES.map((speciality)=>(
            <Link key={speciality.name} href={`/doctors/${encodeURIComponent(speciality.name)}`}>
                <Card className='hover:border-emerald-700/40 transition-all cursor-pointer border-emerald-20 h-full'>
                   <CardContent className='p-6 flex flex-col items-center justify-center text-center h-full'>
                            <div className='w-12 h-12 rounded-full bg-emerald-900/20 flex items-center justify-center mb-4'> 
                                <div>{speciality.icon}</div>
                            </div>
                            <h3 className='font-medium text-white'>{speciality.name}</h3>
                    </CardContent> 
                </Card>
            </Link>
        ))}
    </div>
    </>
  )
}

export default SpecialityPage