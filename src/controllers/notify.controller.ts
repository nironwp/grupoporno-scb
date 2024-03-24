import express from 'express'
import { Payment, MercadoPagoConfig } from 'mercadopago';
import prisma from '../prisma';
const mercadopagoClient = new MercadoPagoConfig({
    accessToken: process.env.MP_TOKEN as string
})
export const mercadoPagoNotify = async (
    req: express.Request,
    res: express.Response
    ) => {
 
        const topic = req.body?.topic || req.body.type;
	    console.log({ topic });
        
        try {
            if (topic === 'payment') {
                const query = req.body.query
                const paymentClient = new Payment(mercadopagoClient)
                const paymentId = req.body.data.id || query['data.id'];
                let payment = await paymentClient.get({
                    id: Number(paymentId)
                });

                let paymentStatus = payment?.status;
                console.log(paymentStatus)
                if(paymentStatus !== 'approved') throw new Error('Not aproved')

                const paymentDatabase = await prisma.payment.findFirst({
                    where: {
                        id: Number(payment.external_reference)
                    },
                    include: {
                        plan: true
                    }
                })

                console.log(paymentDatabase)

                if(paymentDatabase) {
                    await prisma.group.update({
                        where: {
                            id: paymentDatabase?.groupId
                        },
                        data: {
                            impulse: true,
                            impulse_end_date: new Date(Date.now() + paymentDatabase.plan.time * 24 * 60 * 60 * 1000).toISOString() 
                        }
                    })
                    console.log('Grupo Impulsionado com sucesso')
                }
                
                // Return a success response with payment status
                return res.processResponse(200, "Pagamento recebido")
            } else {
                // Handle other cases if needed and return appropriate responses
                return res.processResponse(200, "Topic not supported")
            }
        } catch (error: any) {
            console.log(error)
            // Handle errors and return an error response
            return res.processResponse(200, "Topic inreal")
        }
}