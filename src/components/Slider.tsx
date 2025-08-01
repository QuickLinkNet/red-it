import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        title: 'JSON Validator & Beautifier',
        description: 'Validiere, formatiere und analysiere JSON-Daten mit Monaco Editor - komplett offline im Browser',
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1920&q=80',
        link: '/tools/json-validator'
    },
    {
        title: 'Scrum Kapazitätsplanung',
        description: 'Professionelle Sprint-Planung mit Team-Management, Abwesenheiten und Kapazitätsberechnung',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80',
        link: '/tools/capacity-planning'
    },
    {
        title: 'Code Beautifier & Minifier',
        description: 'Formatiere und komprimiere HTML, CSS, JavaScript & TypeScript mit Syntax-Highlighting',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1920&q=80',
        link: '/tools/code-beautifier-minifier'
    },
    {
        title: 'Cron Job Generator',
        description: 'Erstelle und teste Cron-Ausdrücke mit visueller Vorschau der nächsten Ausführungen',
        image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=1920&q=80',
        link: '/tools/cron-job-generator'
    },
    {
        title: 'Passwort-Generator Pro',
        description: 'Kryptographisch sichere Passwörter mit Mustern, benutzerdefinierten Zeichen und Stärke-Analyse',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1920&q=80',
        link: '/tools/password-generator'
    }
];

export function Slider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative h-[40vh] overflow-hidden">
            <div
                className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className="relative min-w-full"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/70 to-transparent" />
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center">
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="max-w-lg">
                                    <h2 className="text-4xl font-bold text-white">{slide.title}</h2>
                                    <p className="mt-4 text-lg text-gray-300">{slide.description}</p>
                                    <Link to={slide.link}>
                                        <Button className="mt-8" size="lg">
                                            Tool ausprobieren
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-gray-900/70"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-gray-900/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-gray-900/70"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 w-2 rounded-full transition-all ${
                            index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}