import React from 'react'
import axios from "../lib/axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalyticsTab = () => {
	const [analyticsData, setAnalyticsData] = useState({
		users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
	});
	
	const [isLoading, setIsLoading] = useState(true);
	const [dailySalesData, setDailySalesData] = useState([]);

	useEffect(() => {
		const fetchAnalyticsData = async () => {
			try {
				const response = await axios.get("/analytics");
				// Add safe defaults in case the API response is missing data
				setAnalyticsData({
					users: response.data.analyticsData?.users || 0,
					products: response.data.analyticsData?.products || 0,
					totalSales: response.data.analyticsData?.totalSales || 0,
					totalRevenue: response.data.analyticsData?.totalRevenue || 0,
				});
				setDailySalesData(response.data.dailySalesData || []);
			} catch (error) {
				console.error("Error fetching analytics data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchAnalyticsData();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-96">
				<div className="relative">
					<div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
					<Activity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-800 w-6 h-6" />
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4 sm:px-6 lg:px-8 py-12'>
			<div className='max-w-7xl mx-auto'>
				{/* Header */}
				<motion.div 
					className="mb-12"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 mb-2">
						Analytics Dashboard
					</h1>
					<p className="text-gray-600 text-lg flex items-center gap-2">
						<TrendingUp className="w-5 h-5 text-gray-700" />
						Real-time business metrics
					</p>
				</motion.div>

				{/* Cards Grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
					<AnalyticsCard
						title='Total Users'
						value={analyticsData.users.toLocaleString()}
						icon={Users}
						gradient='from-gray-400 via-gray-500 to-gray-600'
						delay={0.1}
					/>
					<AnalyticsCard
						title='Total Products'
						value={analyticsData.products.toLocaleString()}
						icon={Package}
						gradient='from-gray-500 via-gray-600 to-gray-700'
						delay={0.2}
					/>
					<AnalyticsCard
						title='Total Sales'
						value={analyticsData.totalSales.toLocaleString()}
						icon={ShoppingCart}
						gradient='from-gray-600 via-gray-700 to-gray-800'
						delay={0.3}
					/>
					<AnalyticsCard
						title='Total Revenue'
						value={`$${analyticsData.totalRevenue.toLocaleString()}`}
						icon={DollarSign}
						gradient='from-gray-700 via-gray-800 to-gray-900'
						delay={0.4}
					/>
				</div>

				{/* Chart */}
				<motion.div
					className='relative backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-2xl border border-gray-200'
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.5 }}
				>
					<div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 via-transparent to-gray-200/30 rounded-3xl"></div>
					<div className="relative">
						<h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
							<div className="w-1 h-8 bg-gradient-to-b from-gray-600 to-gray-900 rounded-full"></div>
							Sales & Revenue Trends
						</h2>
						<ResponsiveContainer width='100%' height={400}>
							<LineChart data={dailySalesData}>
								<defs>
									<linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#4B5563" stopOpacity={0.8}/>
										<stop offset="100%" stopColor="#4B5563" stopOpacity={0.1}/>
									</linearGradient>
									<linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
										<stop offset="0%" stopColor="#1F2937" stopOpacity={0.8}/>
										<stop offset="100%" stopColor="#1F2937" stopOpacity={0.1}/>
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray='3 3' stroke='rgba(107, 114, 128, 0.2)' />
								<XAxis dataKey='name' stroke='#6B7280' style={{ fontSize: '14px' }} />
								<YAxis yAxisId='left' stroke='#6B7280' style={{ fontSize: '14px' }} />
								<YAxis yAxisId='right' orientation='right' stroke='#6B7280' style={{ fontSize: '14px' }} />
								<Tooltip 
									contentStyle={{ 
										backgroundColor: 'rgba(255, 255, 255, 0.95)', 
										border: '1px solid rgba(209, 213, 219, 0.5)',
										borderRadius: '12px',
										backdropFilter: 'blur(10px)',
										boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
									}}
									labelStyle={{ color: '#1F2937', fontWeight: '600' }}
								/>
								<Legend wrapperStyle={{ paddingTop: '20px' }} />
								<Line
									yAxisId='left'
									type='monotone'
									dataKey='sales'
									stroke='#4B5563'
									strokeWidth={3}
									dot={{ fill: '#4B5563', r: 6 }}
									activeDot={{ r: 8, fill: '#6B7280' }}
									name='Sales'
								/>
								<Line
									yAxisId='right'
									type='monotone'
									dataKey='revenue'
									stroke='#1F2937'
									strokeWidth={3}
									dot={{ fill: '#1F2937', r: 6 }}
									activeDot={{ r: 8, fill: '#374151' }}
									name='Revenue ($)'
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, gradient, delay }) => (
	<motion.div
		className='group relative backdrop-blur-xl bg-white/70 rounded-2xl p-6 shadow-xl border border-gray-200 overflow-hidden hover:border-gray-400 transition-all duration-300'
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay }}
		whileHover={{ y: -8, scale: 1.02 }}
	>
		{/* Animated gradient background */}
		<div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
		
		{/* Glowing orb effect */}
		<div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-5 group-hover:opacity-15 transition-opacity duration-300`} />
		
		<div className='relative z-10'>
			<div className='flex justify-between items-start mb-4'>
				<div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
					<Icon className='h-6 w-6 text-white' />
				</div>
				<div className='opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
					<TrendingUp className='h-5 w-5 text-gray-600' />
				</div>
			</div>
			
			<p className='text-gray-600 text-sm font-medium mb-2 uppercase tracking-wider'>{title}</p>
			<h3 className='text-gray-900 text-4xl font-bold tracking-tight'>{value}</h3>
		</div>
		
		{/* Bottom accent line */}
		<div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
	</motion.div>
);