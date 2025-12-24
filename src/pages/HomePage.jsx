import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceSelector from '../components/ServiceSelector';
import ServiceForm from '../components/ServiceForm';
import PaymentScreen from '../components/PaymentScreen';
import Reviews from '../components/Reviews';

export default function HomePage() {
    const [step, setStep] = useState('select'); // 'select', 'form', 'payment'
    const [selectedService, setSelectedService] = useState(null);
    const [formData, setFormData] = useState(null);

    const handleSelectService = (service) => {
        setSelectedService(service);
        setStep('form');
    };

    const handleFormSubmit = (data) => {
        setFormData(data);
        setStep('payment');
    };

    const handleBackToServices = () => {
        setStep('select');
        setSelectedService(null);
        setFormData(null);
    };

    const handleBackToForm = () => {
        setStep('form');
        setFormData(null);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow container mx-auto px-4">
                {step === 'select' && (
                    <>
                        <ServiceSelector onSelectService={handleSelectService} />
                        <Reviews />
                    </>
                )}

                {step === 'form' && (
                    <ServiceForm
                        service={selectedService}
                        onSubmit={handleFormSubmit}
                        onBack={handleBackToServices}
                    />
                )}

                {step === 'payment' && (
                    <PaymentScreen
                        service={selectedService}
                        formData={formData}
                        onBack={handleBackToForm}
                    />
                )}
            </main>

            <Footer />
        </div>
    );
}
