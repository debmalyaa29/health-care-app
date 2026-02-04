import { getPendingDoctors, getVerifiedDoctors } from '@/actions/admin'
import { TabsContent } from '@/components/ui/tabs'
import React from 'react'


import { PendingDoctors } from './_components/pending-doctors'
import { VerifiedDoctors } from './_components/verifed-doctors'

const AdminPage =async () => {

  const [pendingDoctorsData,verifiedDoctorsData]=  await Promise.all([
        getPendingDoctors(),
        getVerifiedDoctors()
    ])
  return (
    <>
         <TabsContent value="pending" className="border-none p-0">
            <PendingDoctors doctors={pendingDoctorsData.doctors || []}/>
         </TabsContent>
          <TabsContent value="doctors" className="border-none p-0">
            <VerifiedDoctors doctors={verifiedDoctorsData.doctors ||[]}/>
            </TabsContent>
        
    </>
  )
}

export default AdminPage