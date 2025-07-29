import React from "react";
import { FaExternalLinkAlt, FaLeaf, FaHome, FaLungs, FaChartLine, FaThermometerHalf, FaWind } from "react-icons/fa";
import img from "../assets/blog/air-quality.jpg";

export const meta = {
  title: "5 Ways to Improve Your Air Quality for a Healthier Home & Environment",
  author: "Jamie-Leigh Hector",
  date: "2025-06-19",
  tags: ["Eco-friendly", "Home", "Air Quality", "Carbon Reduction"],
  slug: "improve-air-quality",
  image: img,
  excerpt: "Breathe easier at home with these simple air quality tips that also reduce your carbon footprint."
};

// Add the new Table of Contents array here
export const toc = [
  { id: "hidden-connection", text: "The Hidden Connection: Air Quality and Carbon Emissions", level: 2 },
  { id: "shocking-stats", text: "Shocking Indoor Air Quality Statistics", level: 3 },
  { id: "powerful-strategies", text: "5 Powerful Strategies for Cleaner Air & Lower Carbon Emissions", level: 2 },
  { id: "strategy-ventilation", text: "1. Master Natural Ventilation", level: 3 },
  { id: "strategy-purifiers", text: "2. Deploy Natural Air Purifiers", level: 3 },
  { id: "strategy-cleaning", text: "3. Switch to Natural Cleaning Products", level: 3 },
  { id: "strategy-combustion", text: "4. Minimize Indoor Combustion Sources", level: 3 },
  { id: "strategy-humidity", text: "5. Optimize Humidity & Prevent Mold", level: 3 },
  { id: "health-environment-connection", text: "The Health-Environment Connection", level: 2 },
  { id: "advanced-monitoring", text: "Advanced Air Quality Monitoring & Carbon Tracking", level: 2 },
  { id: "action-plan", text: "Your 30-Day Air Quality Action Plan", level: 3 },
];

export default function Post() {
  return (
    <div className="space-y-8">
      <p className="text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-greenbuzz dark:first-letter:text-green-400 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
        Indoor air quality directly impacts both your health and your environmental footprint, yet most people spend 90% of their time breathing air that's 2-5 times more polluted than outdoor air. Poor indoor air quality doesn't just affect your respiratory health—it's often a sign of energy inefficiency and unnecessary carbon emissions from your home's heating, cooling, and ventilation systems.
      </p>

      <h2 id="hidden-connection" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-red-500 pl-4">
        The Hidden Connection: Air Quality and Carbon Emissions
      </h2>

      <p className="text-lg leading-relaxed">
        What many people don't realize is that poor indoor air quality and high carbon emissions often go hand in hand. Homes with bad air circulation typically waste massive amounts of energy through inefficient HVAC systems, air leaks, and the need for constant air purification. Improving air quality naturally reduces your home's carbon footprint while protecting your family's health.
      </p>

      <div id="shocking-stats" className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-xl">
        <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center">
          <FaLungs className="mr-2" />
          Shocking Indoor Air Quality Statistics
        </h3>
        <ul className="space-y-3 text-slate-700 dark:text-slate-300">
          <li>• Indoor air can be <strong className="text-red-600 dark:text-red-400">5x more polluted</strong> than outdoor air</li>
          <li>• Poor ventilation increases home energy consumption by <strong>15-30%</strong></li>
          <li>• <strong>68% of homes</strong> have detectable levels of toxic chemicals</li>
          <li>• Air pollution causes <strong>7 million premature deaths</strong> globally each year</li>
          <li>• Improving air quality can reduce household carbon emissions by <strong>20%</strong></li>
        </ul>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "The healthiest homes are also the most energy-efficient homes. When you improve air quality naturally, you're simultaneously reducing your carbon footprint and energy bills."
        <footer className="text-sm mt-2 not-italic">
          — Track your home's environmental impact with our <a href="/calculator" className="text-greenbuzz dark:text-green-400 hover:underline font-semibold">carbon calculator</a>
        </footer>
      </blockquote>

      <h2 id="powerful-strategies" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-green-500 pl-4">
        5 Powerful Strategies for Cleaner Air & Lower Carbon Emissions
      </h2>

      <div className="space-y-12">
        {/* Strategy 1: Natural Ventilation */}
        <div id="strategy-ventilation" className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
              <FaWind className="text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-300">1. Master Natural Ventilation</h3>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">Impact: 30-50% reduction in mechanical ventilation needs</p>
            </div>
          </div>
          
          <p className="text-lg mb-6">
            Opening windows strategically isn't just about fresh air—it's about reducing your reliance on energy-intensive HVAC systems while dramatically improving indoor air quality. Proper natural ventilation can cut your home's energy consumption by up to 30%.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🌬️ Strategic Ventilation Techniques</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Cross-Ventilation Setup</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• Open windows on opposite sides of your home</li>
                    <li>• Create airflow pathways through hallways</li>
                    <li>• Use fans to enhance natural air movement</li>
                    <li>• Remove furniture blocking air circulation</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2 text-blue-700 dark:text-blue-400">Optimal Timing</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• Early morning: Coolest, cleanest air</li>
                    <li>• Evening: Temperature drops, pollution clears</li>
                    <li>• Avoid peak traffic hours (7-9am, 5-7pm)</li>
                    <li>• Check air quality index before opening</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">💡 Energy & Health Benefits</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">25%</div>
                  <div className="text-sm">Less AC usage</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Average energy savings</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">40%</div>
                  <div className="text-sm">Pollution reduction</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Indoor vs outdoor</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">60%</div>
                  <div className="text-sm">Humidity control</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Mold prevention</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy 2: Air-Purifying Plants */}
        <div id="strategy-purifiers" className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4">
              <FaLeaf className="text-2xl text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-green-800 dark:text-green-300">2. Deploy Natural Air Purifiers</h3>
              <p className="text-green-600 dark:text-green-400 font-semibold">Impact: 15-20% reduction in indoor pollutants</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            Air-purifying plants are nature's answer to indoor pollution, requiring zero electricity while actively removing toxins and producing oxygen. NASA research shows that certain plants can eliminate up to 87% of indoor air pollutants within 24 hours.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🌱 Top Air-Purifying Plants by Room</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 text-green-700 dark:text-green-400">Living Areas</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Snake Plant:</strong> Removes formaldehyde, converts CO₂ at night</li>
                    <li>• <strong>Peace Lily:</strong> Eliminates ammonia, benzene, acetone</li>
                    <li>• <strong>Rubber Plant:</strong> Absorbs airborne bacteria and mold spores</li>
                    <li>• <strong>Spider Plant:</strong> Removes carbon monoxide and xylene</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 text-green-700 dark:text-green-400">Bedrooms & Bathrooms</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Aloe Vera:</strong> Night oxygen production, formaldehyde removal</li>
                    <li>• <strong>Boston Fern:</strong> Excellent humidity control, removes toxins</li>
                    <li>• <strong>Bamboo Palm:</strong> Natural humidifier, benzene elimination</li>
                    <li>• <strong>English Ivy:</strong> Reduces airborne mold by 94%</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📊 Plant vs. Electric Air Purifier Comparison</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded">
                  <h5 className="font-semibold mb-2 text-red-600 dark:text-red-400">Electric Air Purifier</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Energy cost: $50-150/year</li>
                    <li>• Carbon emissions: 200-600kg CO₂/year</li>
                    <li>• Filter replacement: $50-200/year</li>
                    <li>• Noise pollution: 30-60 decibels</li>
                  </ul>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded">
                  <h5 className="font-semibold mb-2 text-green-600 dark:text-green-400">Air-Purifying Plants</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Energy cost: $0/year</li>
                    <li>• Carbon impact: Negative (absorbs CO₂)</li>
                    <li>• Maintenance: Water + occasional fertilizer</li>
                    <li>• Additional benefits: Humidity, aesthetics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy 3: Natural Cleaning Products */}
        <div id="strategy-cleaning" className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🧽</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">3. Switch to Natural Cleaning Products</h3>
              <p className="text-yellow-600 dark:text-yellow-400 font-semibold">Impact: 70% reduction in indoor chemical pollutants</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            Conventional cleaning products release volatile organic compounds (VOCs) that pollute indoor air and contribute to climate change. Natural alternatives clean just as effectively while eliminating toxic emissions and reducing your carbon footprint through simplified manufacturing and packaging.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🏠 DIY Natural Cleaning Arsenal</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-400">Multi-Purpose Cleaners</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>All-purpose:</strong> White vinegar + water (1:1 ratio)</li>
                    <li>• <strong>Glass cleaner:</strong> Vinegar + water + drop of dish soap</li>
                    <li>• <strong>Degreaser:</strong> Baking soda + water paste</li>
                    <li>• <strong>Disinfectant:</strong> 3% hydrogen peroxide solution</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 text-yellow-700 dark:text-yellow-400">Specialized Solutions</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Toilet cleaner:</strong> Baking soda + vinegar</li>
                    <li>• <strong>Carpet freshener:</strong> Baking soda + essential oils</li>
                    <li>• <strong>Metal polish:</strong> Lemon juice + olive oil</li>
                    <li>• <strong>Drain cleaner:</strong> Baking soda + hot water + vinegar</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">💰 Cost & Environmental Comparison</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">90%</div>
                  <div className="text-sm">Cost savings</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">vs. commercial cleaners</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">75%</div>
                  <div className="text-sm">Less packaging</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Reduced plastic waste</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Zero</div>
                  <div className="text-sm">VOC emissions</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Cleaner indoor air</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy 4: Reduce Indoor Combustion */}
        <div id="strategy-combustion" className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🕯️</span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-purple-800 dark:text-purple-300">4. Minimize Indoor Combustion Sources</h3>
              <p className="text-purple-600 dark:text-purple-400 font-semibold">Impact: 50-80% reduction in particulate matter</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            Candles, incense, and gas appliances release particulate matter and toxic compounds directly into your living space. While occasional use might seem harmless, regular indoor combustion significantly degrades air quality and contributes to both health problems and carbon emissions.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">🔍 Hidden Indoor Pollution Sources</h4>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-2 text-red-600 dark:text-red-400">High-Emission Sources</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Scented candles:</strong> Release benzene, toluene, formaldehyde</li>
                      <li>• <strong>Incense sticks:</strong> Generate 45x more particles than cigarettes</li>
                      <li>• <strong>Gas stoves:</strong> Produce NO₂ and carbon monoxide</li>
                      <li>• <strong>Fireplaces:</strong> Major source of fine particulate matter</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2 text-green-600 dark:text-green-400">Clean Alternatives</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Essential oil diffusers:</strong> No combustion required</li>
                      <li>• <strong>Soy/beeswax candles:</strong> Burn cleaner, last longer</li>
                      <li>• <strong>Electric heating:</strong> Zero indoor emissions</li>
                      <li>• <strong>LED lighting:</strong> No heat or emissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">📈 Indoor Air Quality Impact</h4>
              <p className="text-sm mb-3">Burning one scented candle for 3 hours produces particulate matter equivalent to:</p>
              <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="font-semibold text-red-600 dark:text-red-400">15 cigarettes</div>
                  <div>Particulate emissions</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="font-semibold text-orange-600 dark:text-orange-400">2 hours</div>
                  <div>Cooking on gas stove</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">30 minutes</div>
                  <div>Diesel exhaust exposure</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy 5: Humidity & Mold Control */}
        <div id="strategy-humidity" className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-8">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mr-4">
              <FaThermometerHalf className="text-2xl text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-teal-800 dark:text-teal-300">5. Optimize Humidity & Prevent Mold</h3>
              <p className="text-teal-600 dark:text-teal-400 font-semibold">Impact: 25% reduction in respiratory irritants</p>
            </div>
          </div>

          <p className="text-lg mb-6">
            Maintaining optimal humidity levels (40-60%) prevents mold growth while reducing the energy needed for heating and cooling. Poor humidity control forces HVAC systems to work harder, increasing both energy bills and carbon emissions while creating conditions for harmful biological pollutants.
          </p>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">💧 Natural Humidity Control Methods</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-400">Reducing Excess Humidity</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Exhaust fans:</strong> Use during cooking and showering</li>
                    <li>• <strong>Fix leaks:</strong> Address water damage immediately</li>
                    <li>• <strong>Dehumidifying plants:</strong> Boston fern, English ivy</li>
                    <li>• <strong>Proper ventilation:</strong> Ensure air circulation in all rooms</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-3 text-teal-700 dark:text-teal-400">Adding Healthy Humidity</h5>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Humidifying plants:</strong> Peace lily, spider plant</li>
                    <li>• <strong>Water bowls:</strong> Place near heat sources</li>
                    <li>• <strong>Hang-dry clothes:</strong> Natural humidity boost</li>
                    <li>• <strong>Shower steam:</strong> Leave bathroom door open briefly</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">🎯 Optimal Humidity Benefits</h4>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">15%</div>
                  <div className="text-sm">Energy savings</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Heating/cooling efficiency</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">85%</div>
                  <div className="text-sm">Mold prevention</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">At optimal levels</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">40%</div>
                  <div className="text-sm">Less dust mites</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Allergen reduction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 id="health-environment-connection" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-orange-500 pl-4">
        The Health-Environment Connection: Why Air Quality Matters for Climate Action
      </h2>

      <p className="text-lg leading-relaxed">
        Improving indoor air quality isn't just about personal health—it's a crucial component of climate action. Homes with better air quality typically have lower carbon footprints because they require less energy for air purification, ventilation, and climate control. When you breathe cleaner air, you're also likely living more sustainably.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-300">Health Benefits</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Reduced respiratory issues:</strong> 30-50% fewer symptoms</li>
            <li>• <strong>Better sleep quality:</strong> Improved oxygen levels</li>
            <li>• <strong>Enhanced cognitive function:</strong> 15% boost in productivity</li>
            <li>• <strong>Lower allergy symptoms:</strong> Reduced triggers and irritants</li>
          </ul>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-300">Environmental Benefits</h3>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Lower energy consumption:</strong> 20-30% reduction in HVAC use</li>
            <li>• <strong>Reduced chemical production:</strong> Less demand for air fresheners</li>
            <li>• <strong>Decreased plastic waste:</strong> Fewer air purifier filters</li>
            <li>• <strong>Carbon sequestration:</strong> Plants actively remove CO₂</li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">Track Your Complete Environmental Impact</h3>
        <p className="mb-4">
          Improving air quality is just one part of reducing your overall carbon footprint. Understanding your complete environmental impact—from energy usage to transportation to consumption—helps you make informed decisions about where to focus your sustainability efforts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="/calculator" className="bg-greenbuzz hover:bg-green-700 text-white font-semibold py-2 px-4 rounded text-center transition-colors">
            Calculate Your Carbon Footprint
          </a>
          <a href="/badge" className="border-2 border-greenbuzz text-greenbuzz dark:text-green-400 hover:bg-greenbuzz hover:text-white font-semibold py-2 px-4 rounded text-center transition-colors">
            Track Your Progress
          </a>
        </div>
      </div>

      <h2 id="advanced-monitoring" className="text-3xl font-bold text-slate-900 dark:text-white border-l-4 border-purple-500 pl-4">
        Advanced Air Quality Monitoring & Carbon Tracking
      </h2>

      <p className="text-lg leading-relaxed">
        To truly optimize your indoor environment, consider investing in air quality monitoring alongside carbon footprint tracking. Many of the same factors that improve air quality also reduce energy consumption and carbon emissions, making it possible to optimize both simultaneously.
      </p>

      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4">🔬 Key Metrics to Monitor</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Air Quality Indicators</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>PM2.5 levels:</strong> Fine particulate matter</li>
              <li>• <strong>VOC concentration:</strong> Volatile organic compounds</li>
              <li>• <strong>CO₂ levels:</strong> Indicator of ventilation needs</li>
              <li>• <strong>Humidity percentage:</strong> Mold and comfort control</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Energy Efficiency Metrics</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>HVAC runtime:</strong> Hours of mechanical ventilation</li>
              <li>• <strong>Energy usage patterns:</strong> Peak consumption periods</li>
              <li>• <strong>Temperature stability:</strong> Efficiency of natural cooling</li>
              <li>• <strong>Air change rates:</strong> Natural vs. mechanical ventilation</li>
            </ul>
          </div>
        </div>
      </div>

      <blockquote className="bg-greenbuzz/10 dark:bg-green-400/10 border-l-4 border-greenbuzz dark:border-green-400 p-6 rounded-r-xl italic text-lg">
        "The most sustainable homes are those that work with nature rather than against it. When you improve air quality naturally, you're simultaneously reducing energy consumption and creating a healthier environment for your family."
        <footer className="text-sm mt-2 not-italic">
          — Learn more at <a 
            href="https://www.nhs.uk/live-well/healthy-body/how-to-improve-indoor-air-quality/" 
            target="_blank" 
            rel="noopener"
            className="text-greenbuzz dark:text-green-400 hover:underline inline-flex items-center"
          >
            NHS: How to Improve Indoor Air Quality <FaExternalLinkAlt className="ml-1 text-xs" />
          </a>
        </footer>
      </blockquote>

      <div className="bg-gradient-to-r from-greenbuzz/10 to-green-600/10 border border-greenbuzz/20 dark:border-green-400/20 rounded-xl p-8">
        <h3 className="text-2xl font-bold mb-4 text-center">Start Your Healthy Home Journey</h3>
        <p className="text-lg mb-6 text-center">
          Cleaner air and lower carbon emissions go hand in hand. Begin tracking your environmental impact today to see how home improvements affect both your health and your carbon footprint.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/calculator" className="bg-greenbuzz hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Calculate Your Impact
          </a>
          <a href="/badge" className="border-2 border-greenbuzz text-greenbuzz dark:text-green-400 hover:bg-greenbuzz hover:text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors">
            Get Your Progress Badge
          </a>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
          Join thousands already improving their homes and tracking their environmental impact. Read our guides on <a href="/blog/save-energy-in-summer" className="text-greenbuzz dark:text-green-400 hover:underline">seasonal energy optimization</a> and <a href="/blog/plastic-climate-crisis" className="text-greenbuzz dark:text-green-400 hover:underline">reducing your overall carbon footprint</a>.
        </p>
      </div>

      <div id="action-plan" className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaHome className="mr-2 text-blue-600 dark:text-blue-400" />
          Your 30-Day Air Quality Action Plan
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Week 1-2: Foundation</h4>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li>Audit current air quality and ventilation</li>
              <li>Open windows for cross-ventilation daily</li>
              <li>Add 2-3 air-purifying plants to main living areas</li>
              <li>Switch to natural cleaning products</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Week 3-4: Optimization</h4>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              <li>Reduce indoor combustion sources</li>
              <li>Optimize humidity levels throughout home</li>
              <li>Monitor energy consump</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}