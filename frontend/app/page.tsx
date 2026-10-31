"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import AuthModal from "@/components/auth-model";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Menu,
  Moon,
  Sparkles,
  Sun,
  Users,
  X,
  Zap,
  Terminal,
  Cpu,
  ArrowRight,
  FileText,
  Brain,
  ClipboardList,
  LineChart,
  Search,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useSession } from "@/lib/auth-client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function LandingPage() {
  const { setTheme, theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleAuthAction = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user) {
      localStorage.setItem("adminId", session?.user.id as string);
      localStorage.setItem("adminEmail", session?.user.email as string);
      localStorage.setItem("adminName", session?.user.name as string);
      router.push("/dashboard");
    }
  }, [session, router]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
          isScrolled ? "bg-background/95 border-b shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="text-xl md:text-2xl font-bold tracking-tight flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="flex items-center gap-2">
                <span className="font-bold">TaskPilot Labs</span>
              </Link>
            </motion.div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              How It Works
            </Link>
            {/* <Link
              href="#pricing"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Pricing
            </Link> */}
            <Link
              href="#about"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              About Us
            </Link>
            <Link
              href="#use-cases"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              Use Cases
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-blue-500 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <div className="hidden md:flex items-center gap-2">
              <Button
                className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-md hover:shadow-lg transition-all"
                onClick={() => handleAuthAction()}
                disabled={isProcessing}
              >
                {session ? "Dashboard" : "Get Started Free"}
              </Button>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden rounded-full"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold tracking-tight">
                        TaskPilot Labs
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-full"
                      aria-label="Close menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <nav className="flex flex-col gap-4">
                    <Link
                      href="#features"
                      className="text-sm font-medium hover:text-blue-500 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link
                      href="#how-it-works"
                      className="text-sm font-medium hover:text-blue-500 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                    {/* <Link
                      href="#pricing"
                      className="text-sm font-medium hover:text-blue-500 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link> */}
                    <Link
                      href="#about"
                      className="text-sm font-medium hover:text-blue-500 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About Us
                    </Link>
                    <Link
                      href="#use-cases"
                      className="text-sm font-medium hover:text-blue-500 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Use Cases
                    </Link>
                    <Link
                      href="#faq"
                      className="text-sm font-medium hover:text-blue-500 transition-colors px-2 py-1 rounded-lg hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                  </nav>

                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      className="w-full rounded-full bg-gradient-to-r from-blue-600 to-blue-500"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleAuthAction();
                      }}
                      disabled={isProcessing}
                    >
                      {session ? "Dashboard" : "Get Started Free"}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-b from-background via-background to-muted/30">
        <div className="absolute inset-0 bg-grid-small-pattern opacity-[0.03] dark:opacity-[0.05]"></div>

        <motion.div
          className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="container relative">
          <div className="max-w-[1000px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-sm font-medium text-blue-500 mb-6"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              <span>AI-Powered Project Management</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Revolutionize
              </span>{" "}
              Your Software Development
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto mb-8"
            >
              AI-powered tools that create detailed documentation, extract
              requirements, assign tasks intelligently, and provide predictive
              analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-5"
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-md hover:shadow-lg w-full sm:w-auto text-base gap-2"
                  onClick={() => handleAuthAction()}
                  disabled={isProcessing}
                >
                  {session ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full w-full sm:w-auto text-base"
                asChild
              >
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-4"
            >
              <a
                href="https://www.producthunt.com/posts/taskpilot-labs?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-taskpilot-labs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=950559&theme=neutral&t=1744028715565"
                  alt="Taskpilot Labs - AI-Powered Project Management for Software Development | Product Hunt"
                  style={{ width: "250px", height: "54px" }}
                  width="250"
                  height="54"
                  className="hover:opacity-90 transition-opacity"
                />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="relative max-w-[800px] mx-auto rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="bg-muted/80 backdrop-blur-sm p-3 border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    project-requirements.md
                  </div>
                </div>

                <div className="font-mono text-sm md:text-base text-left p-4 bg-background/80 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-blue-500 font-semibold mb-2"
                  >
                    # Project Requirements
                  </motion.div>

                  <AnimatePresence>
                    {[
                      "## User Authentication",
                      "- Implement secure login with OAuth 2.0",
                      "- Add password reset functionality",
                      "- Create user profile management",
                      "",
                      "## Dashboard Features",
                      "- Real-time analytics dashboard",
                      "- Customizable widgets for different metrics",
                      "- Data export in multiple formats",
                    ].map((line, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                        className={
                          line.startsWith("##")
                            ? "text-blue-500/80 font-medium mt-3 mb-1"
                            : "text-foreground/90"
                        }
                      >
                        {line}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className="mt-4 p-3 rounded-md bg-blue-500/10 border border-blue-500/20"
                  >
                    <div className="flex items-center gap-2 text-blue-500 font-medium mb-1">
                      <Sparkles className="h-4 w-4" /> AI Suggestion
                    </div>
                    <div className="text-sm text-foreground/80">
                      Consider adding multi-factor authentication for enhanced
                      security and compliance with GDPR requirements.
                    </div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                className="absolute -right-4 top-1/4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-lg text-xs font-medium"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.8, duration: 0.5 }}
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Tasks
                auto-generated
              </motion.div>

              <motion.div
                className="absolute -left-4 bottom-1/4 flex items-center gap-1 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-lg text-xs font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 3, duration: 0.5 }}
              >
                <Zap className="h-3.5 w-3.5 text-blue-500" /> AI optimized
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Boost Productivity with <span className="text-blue-500">AI</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Our AI-powered tools automate your software development process
              from documentation to analytics.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: FileText,
                title: "AI-Generated Documentation",
                description:
                  "Automatically create detailed SRS, PRDs, and project plans with AI, saving hours of manual work.",
              },
              {
                icon: Brain,
                title: "Intelligent Requirement Extraction",
                description:
                  "Extract and organize project requirements from briefs or meetings with advanced AI analysis.",
              },
              {
                icon: ClipboardList,
                title: "Smart Task Assignment",
                description:
                  "Let AI assign tasks to your team based on skills and availability, ensuring efficient workflows.",
              },
              {
                icon: Search,
                title: "AI Research Tool",
                description:
                  "Leverage our powerful AI research capabilities to gather information, analyze trends, and make data-driven decisions.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none h-full bg-background/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all overflow-hidden group">
                  <CardHeader>
                    <motion.div
                      className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-500/5 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <feature.icon className="h-6 w-6 text-blue-500" />
                    </motion.div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-small-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        <motion.div
          className="absolute top-40 right-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Simplify Your Workflow in{" "}
              <span className="text-blue-500">Minutes</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See how TaskPilot Labs automates your software development process
              with just a few simple steps.
            </p>
          </div>

          <div className="max-w-[1000px] mx-auto">
            <div className="relative">
              <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-500/50 to-blue-500/20 md:transform md:-translate-x-[0.5px]"></div>

              {[
                {
                  step: "01",
                  title: "Input Project Brief",
                  description:
                    "Upload your requirements or describe them in natural language.",
                  icon: Terminal,
                  align: "right",
                  codeSnippet:
                    "Project: E-commerce Platform\nRequirements: User authentication, product catalog, shopping cart, payment integration...",
                },
                {
                  step: "02",
                  title: "AI Generates Documentation",
                  description:
                    "Our AI creates SRS, PRDs, and project plans instantly.",
                  icon: Cpu,
                  align: "left",
                  codeSnippet:
                    "Generating SRS document...\nCreating task breakdown...\nEstimating timelines...\nComplete! 24 tasks created.",
                },
                {
                  step: "03",
                  title: "Extract Requirements",
                  description:
                    "AI analyzes and organizes requirements from your brief or meetings",
                  icon: Brain,
                  align: "right",
                  codeSnippet:
                    "Analyzing requirements...\nIdentifying dependencies...\nPrioritizing features...\nComplete! 18 requirements extracted.",
                },
                {
                  step: "04",
                  title: "Assign & Track",
                  description:
                    "AI assigns tasks based on skills and monitors progress with predictive analytics.",
                  icon: LineChart,
                  align: "left",
                  codeSnippet:
                    "Project progress: 68%\nOn track: 18 tasks\nAt risk: 2 tasks\nCompleted: 12 tasks\nPrediction: Project completion in 14 days",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex mb-16 md:mb-24 ${
                    index % 2 !== 0 ? "md:flex-row-reverse" : ""
                  } flex-col md:flex-row items-start relative`}
                >
                  <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 z-10 flex items-center justify-center">
                    <motion.div
                      className="h-14 w-14 rounded-full bg-background border-4 border-blue-500 flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <step.icon className="h-6 w-6 text-blue-500" />
                    </motion.div>
                  </div>

                  <div
                    className={`md:w-1/2 pl-20 md:pl-0 ${
                      index % 2 === 0 ? "md:pr-16 text-right" : "md:pl-16"
                    }`}
                  >
                    <div
                      className={`bg-gradient-to-br from-background to-muted/30 p-6 rounded-xl border border-border/50 shadow-md hover:shadow-lg transition-all ${
                        index % 2 === 0
                          ? "md:rounded-tr-none"
                          : "md:rounded-tl-none"
                      }`}
                    >
                      <div className="inline-flex h-8 w-8 rounded-full bg-blue-500/10 items-center justify-center text-blue-500 font-medium text-lg mb-3">
                        {step.step}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>

                      <motion.div
                        className="bg-background/80 border border-border/50 rounded-lg p-3 font-mono text-xs text-muted-foreground overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        whileInView={{ height: "auto", opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                      >
                        {step.codeSnippet.split("\n").map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -5 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              delay: 0.5 + index * 0.2 + i * 0.1,
                              duration: 0.3,
                            }}
                          >
                            {line}
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  <div className="hidden md:block md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              Use Cases
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Transform Your <span className="text-blue-500">Development</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore how TaskPilot Labs empowers development teams with AI
              automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {[
              {
                title: "Accelerate Project Kickoff",
                description:
                  "Launch projects faster with instant AI-generated documentation and task planning.",
                icon: Zap,
                gradient: "from-blue-500/20 to-blue-500/5",
              },
              {
                title: "Boost Team Efficiency",
                description:
                  "Free developers from admin tasks so they can focus on coding and innovation.",
                icon: Users,
                gradient: "from-blue-500/20 to-blue-500/5",
              },
              {
                title: "Enhance Project Accuracy",
                description:
                  "Reduce errors in requirements and task assignment with AI precision.",
                icon: CheckCircle2,
                gradient: "from-blue-500/20 to-blue-500/5",
              },
              {
                title: "Scale Development Teams",
                description:
                  "Manage larger projects with less overhead using automated workflows.",
                icon: Layers,
                gradient: "from-blue-500/20 to-blue-500/5",
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-background/60 backdrop-blur-sm border-none shadow-md h-full overflow-hidden group">
                  <CardHeader className="pb-0">
                    <motion.div
                      className={`h-12 w-12 rounded-lg bg-gradient-to-r ${useCase.gradient} flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors duration-300`}
                      whileHover={{ scale: 1.05, rotate: -5 }}
                    >
                      <useCase.icon className="h-6 w-6 text-blue-500" />
                    </motion.div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-muted-foreground">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 md:py-32 relative overflow-hidden bg-muted/30"
      >
        <div className="absolute inset-0 bg-grid-small-pattern opacity-[0.03] dark:opacity-[0.05]"></div>
        <motion.div
          className="absolute top-40 left-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              About Us
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              From Idea to <span className="text-blue-500">Innovation</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              We're on a mission to transform software development with
              AI-powered automation.
            </p>
          </div>

          <div className="grid gap-16 md:gap-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Our Story
                </h3>
                <p className="text-muted-foreground">
                  TaskPilot Labs was born from a simple observation: developers
                  spend too much time on documentation and project management
                  instead of doing what they love—coding and creating.
                </p>
                <p className="text-muted-foreground">
                  Founded in 2025 by Keval Solanki and Mohit Gajjar, two
                  software engineers frustrated with inefficient workflows,
                  TaskPilot Labs set out to build an AI-powered solution that
                  automates the tedious parts of software development.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-blue-500/5 blur-xl -m-4"></div>
                <div className="relative bg-muted/30 backdrop-blur-sm p-6 rounded-2xl border border-border/50 shadow-lg">
                  <h4 className="text-xl font-bold mb-4">Our Mission</h4>
                  <p className="text-muted-foreground mb-4">
                    We believe that by automating routine tasks, we can free
                    developers to focus on what matters most: building great
                    software that solves real problems.
                  </p>
                  <p className="text-muted-foreground">
                    Our mission is to create AI tools that understand the
                    nuances of software development, learn from your team's
                    patterns, and streamline workflows—all while maintaining the
                    highest standards of security and privacy.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-16">
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Got <span className="text-blue-500">Questions</span>? We've Got
              Answers
            </h2>
            <p className="text-xl text-muted-foreground">
              Learn more about how TaskPilot Labs can streamline your software
              development process.
            </p>
          </div>

          <div className="max-w-[800px] mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "What exactly does TaskPilot Labs do?",
                  answer:
                    "TaskPilot Labs uses AI to automate your software development workflow. It generates documentation like SRS and PRDs, extracts requirements intelligently, assigns tasks to your team based on skills, and provides predictive analytics—all in minutes.",
                },
                {
                  question: "How accurate is the AI-generated documentation?",
                  answer:
                    "Our AI is trained on thousands of software projects to produce highly accurate documentation. You can review and edit everything to ensure it meets your standards.",
                },
                {
                  question: "Is my project data safe with TaskPilot Labs?",
                  answer:
                    "Absolutely. We prioritize security with end-to-end encryption and compliance with industry standards like GDPR. Your data stays private and secure.",
                },
                {
                  question: "Do I need technical skills to use TaskPilot Labs?",
                  answer:
                    "Not at all! TaskPilot Labs is designed for ease of use. Simply input your project details, and our AI handles the rest—no coding required.",
                },
                // {
                //   question: "How does your pricing work?",
                //   answer:
                //     "We offer a free plan for small teams and a Professional plan for larger organizations. You can choose monthly or annual billing, with annual billing providing a 16% discount. All plans include our core AI features, with higher tiers offering more team members, projects, and advanced capabilities.",
                // },
                {
                  question: "How can I get support if I run into issues?",
                  answer:
                    "We offer a comprehensive help center with tutorials and guides. You can also reach out to our support team via email for personalized assistance.",
                },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-blue-600 text-primary-foreground relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />

        <div className="container relative">
          <div className="max-w-[800px] mx-auto text-center">
            <motion.h2
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Revolutionize Your Development Process?
            </motion.h2>
            <motion.p
              className="text-xl opacity-90 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Join thousands of teams using TaskPilot Labs to automate workflows
              and build software faster!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                size="lg"
                variant="secondary"
                className="text-lg gap-2"
                onClick={() => handleAuthAction()}
              >
                {session ? "Go to Dashboard" : "Start Your Journey"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
           
          </div>
        </div>
      </section>

      {/* Featured On Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container">
          <div className="text-center max-w-[800px] mx-auto mb-8">
            <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20">
              Featured On
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Recognized by the{" "}
              <span className="text-blue-500">Tech Community</span>
            </h2>
          </div>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -5 }}
              className="flex justify-center"
            >
              <a
                href="https://www.producthunt.com/posts/taskpilot-labs?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-taskpilot-labs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=950559&theme=neutral&t=1744028715565"
                  alt="Taskpilot Labs - AI-Powered Project Management for Software Development | Product Hunt"
                  style={{ width: "250px", height: "54px" }}
                  width="250"
                  height="54"
                  className="hover:opacity-90 transition-opacity"
                />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/assets/logo.png"
                  alt="TaskPilot Labs Logo"
                  width={40}
                  height={40}
                />
                <span className="text-xl font-bold">TaskPilot Labs</span>
              </div>
              <p className="text-gray-400 max-w-md">
                AI-powered project management for software development teams.
                Automate documentation, extract requirements, assign tasks, and
                monitor progress.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/taskpilotlabs/"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/TaskPilot-AI"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/taskpilotlabs/"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                {/* <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li> */}
                {/* <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li> */}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                {/* <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </a>
                </li> */}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Address</h3>
              <ul className="space-y-2">
                <li>
                  <a className="text-gray-400 hover:text-blue-400 transition-colors">
                    Shilp Complex, New Sama, Vadodara, 390024 Gujarat, India
                  </a>
                </li>

                <li>
                  <a className="text-gray-400 hover:text-blue-400 transition-colors">
                    contact.taskpilot@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} TaskPilot Labs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => router.push("/dashboard")}
      />
    </div>
  );
}
