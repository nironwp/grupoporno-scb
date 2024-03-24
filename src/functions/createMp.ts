import { MercadoPagoConfig, Preference } from 'mercadopago';
const mercadopagoClient = new MercadoPagoConfig({
    accessToken: process.env.MP_TOKEN as string
})

import type { CreatePreferencePayload } from 'mercadopago/models/preferences/create-payload.model';

export async function createMercadoPagoCheckout(subscription: { childCardTitle: any; id: string; price: any; }, external_reference_id: number) {
	try {
		const URL_SUCCESS = process.env.SITE_URL
		const URL_FAILED = process.env.SITE_URL
		const URL_NOTIFY = `${process.env.API_URL}/notify/mercadopago`;


		const preference: CreatePreferencePayload = {
			items: [
				{
					title: subscription.childCardTitle,
					unit_price: subscription.price,
					quantity: 1,
				},
			],
			auto_return: 'approved',
			back_urls: {
				success: URL_SUCCESS,
				failure: URL_FAILED,
			},
			external_reference: external_reference_id+'',
			notification_url: URL_NOTIFY,
		};

		const preferenceClient = new Preference(mercadopagoClient);
        const response = await preferenceClient.create({
            body: {
                items: [
                    {
                        title: subscription.childCardTitle,
                        unit_price: subscription.price,
                        quantity: 1,
                        id: subscription.id
                    }
                ],
                auto_return: preference.auto_return,
                back_urls: preference.back_urls,
                notification_url: URL_NOTIFY,
				external_reference: preference.external_reference
            },
            requestOptions: {
                timeout: 5000
            }
        })

		return { url: response.init_point }
	} catch (error) {
		return {
				error: 'An error occurred while creating the preference.',
			}
	}
}
