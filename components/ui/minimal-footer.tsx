import {
    Facebook,
    Github,
    Grid2x2Plus,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
} from 'lucide-react';
import { cn } from "@/lib/utils";

export function MinimalFooter() {
    const year = new Date().getFullYear();

    const company = [
        {
            title: 'GEC Madhubani',
            href: 'https://gecmadhubani.org.in/',
        },
        {
            title: 'Mithila Heritage',
            href: '#about-madhubani',
        },
        {
            title: 'Event Gallery',
            href: '#',
        },
        {
            title: 'Contact Us',
            href: '#',
        },
    ];

    const resources = [
        {
            title: 'About',
            href: '#about',
        },
        {
            title: 'Events',
            href: '#events',
        },
        {
            title: 'Schedule',
            href: '#schedule',
        },
        {
            title: 'Hackathon',
            href: '#hackathon',
        },
        {
            title: 'Workshops',
            href: '#workshops',
        },
    ];

    const socialLinks = [
        {
            icon: <Facebook className="size-4" />,
            link: '#',
        },
        {
            icon: <Twitter className="size-4" />,
            link: '#',
        },
        {
            icon: <Instagram className="size-4" />,
            link: '#',
        },
        {
            icon: <Linkedin className="size-4" />,
            link: '#',
        },
        {
            icon: <Github className="size-4" />,
            link: '#',
        },
    ];

    return (
        <footer className="relative mt-20">
            <div className="mx-auto max-w-6xl md:border-x border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="bg-white/5 absolute inset-x-0 h-px w-full" />
                <div className="grid max-w-6xl grid-cols-6 gap-8 p-8 md:p-12">
                    <div className="col-span-6 flex flex-col gap-6 md:col-span-4">
                        <a href="/" className="w-max opacity-80 hover:opacity-100 transition-opacity">
                            <Grid2x2Plus className="size-8 text-[#00f5ff] mb-2" />
                            <div className="font-orbitron font-black text-2xl tracking-widest text-[#00f5ff]">
                                TECH<span className="text-white">EXOTICA</span>
                            </div>
                        </a>
                        <p className="text-slate-400 max-w-md font-rajdhani text-base leading-relaxed">
                            The annual technical festival of Government Engineering College Madhubani — where innovation meets excellence. Join us on March 23–24, 2026.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((item, i) => (
                                <a
                                    key={i}
                                    className="hover:bg-white/5 rounded-full border border-white/10 p-2 transition-all hover:border-[#00f5ff]/50 hover:text-[#00f5ff]"
                                    target="_blank"
                                    href={item.link}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3 w-full md:col-span-1">
                        <span className="text-slate-500 mb-4 block text-xs font-orbitron tracking-widest uppercase">
                            Fest Info
                        </span>
                        <div className="flex flex-col gap-2">
                            {resources.map(({ href, title }, i) => (
                                <a
                                    key={i}
                                    className="w-max py-1 text-sm font-rajdhani text-slate-400 duration-200 hover:text-[#00f5ff] hover:underline"
                                    href={href}
                                >
                                    {title}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-3 w-full md:col-span-1">
                        <span className="text-slate-500 mb-4 block text-xs font-orbitron tracking-widest uppercase">Organization</span>
                        <div className="flex flex-col gap-2">
                            {company.map(({ href, title }, i) => (
                                <a
                                    key={i}
                                    className="w-max py-1 text-sm font-rajdhani text-slate-400 duration-200 hover:text-[#00f5ff] hover:underline"
                                    href={href}
                                >
                                    {title}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white/5 absolute inset-x-0 h-px w-full" />
                <div className="flex max-w-6xl flex-col items-center justify-between gap-4 pt-8 pb-10 px-8 md:flex-row border-t border-white/5">
                    <p className="text-slate-500 text-sm font-rajdhani tracking-wider text-center md:text-left">
                        © 2026 <span className="text-[#00f5ff]">Techexotica</span> · GEC Madhubani. All rights reserved.
                    </p>
                    <p className="text-slate-600 text-xs font-rajdhani tracking-widest uppercase text-center">
                        Built with ❤️ by Tech Committee
                    </p>
                </div>
            </div>
        </footer>
    );
}
