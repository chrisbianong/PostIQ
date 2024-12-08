import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          LinkedIn Content Performance Analyzer
        </h1>
        
        <div className="grid gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Analyze Your LinkedIn Content
            </h2>
            <p className="mb-4">
              Track engagement, analyze sentiment, and get personalized recommendations
              to improve your LinkedIn content strategy.
            </p>
            <Link 
              href="/signup"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              title="Track Engagement"
              description="Monitor likes, comments, and shares on your LinkedIn posts"
            />
            <FeatureCard 
              title="Sentiment Analysis"
              description="Understand how your audience responds to your content"
            />
            <FeatureCard 
              title="Smart Recommendations"
              description="Get personalized tips to improve your content strategy"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}