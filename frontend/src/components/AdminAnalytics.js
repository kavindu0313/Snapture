import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminAnalytics.css';
import { jsPDF } from 'jspdf';

function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');
  const [reportType, setReportType] = useState('user-growth');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [showReportModal, setShowReportModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    postActivity: [],
    engagementRates: [],
    topCategories: [],
    deviceUsage: [],
    peakHours: []
  });

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // In a production environment, this would be a real API call
      // const response = await axios.get(`http://localhost:8080/admin/analytics?timeRange=${timeRange}`);
      // setAnalyticsData(response.data);
      
      // For now, generate mock data based on the selected time range
      generateMockData(timeRange);
      setLoading(false);
    } catch (err) {
      setError('Error fetching analytics data');
      setLoading(false);
      console.error(err);
    }
  };

  // Generate mock data based on time range
  const generateMockData = (range) => {
    // Define date labels based on time range
    let labels = [];
    let now = new Date();
    
    switch(range) {
      case 'day':
        for (let i = 0; i < 24; i++) {
          labels.push(`${i}:00`);
        }
        break;
      case 'week':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          labels.push(days[d.getDay()]);
        }
        break;
      case 'month':
        for (let i = 30; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
        }
        break;
      case 'year':
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
          labels.push(months[i]);
        }
        break;
      default:
        labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }

    // Generate user growth data
    const userGrowth = labels.map(() => Math.floor(Math.random() * 50) + 10);
    
    // Generate post activity data
    const postActivity = labels.map(() => Math.floor(Math.random() * 100) + 20);
    
    // Generate engagement rates data (as percentages)
    const engagementRates = labels.map(() => (Math.random() * 10) + 2);
    
    // Generate top categories data
    const categories = ['Portrait', 'Landscape', 'Street', 'Wildlife', 'Macro', 'Black & White'];
    const topCategories = categories.map(category => ({
      name: category,
      count: Math.floor(Math.random() * 1000) + 100
    })).sort((a, b) => b.count - a.count);
    
    // Generate device usage data
    const deviceUsage = [
      { name: 'Mobile', percentage: 65 },
      { name: 'Desktop', percentage: 28 },
      { name: 'Tablet', percentage: 7 }
    ];
    
    // Generate peak hours data
    const peakHours = Array.from({length: 24}, (_, i) => ({
      hour: i,
      users: Math.floor(Math.random() * 200) + (i >= 8 && i <= 22 ? 100 : 20)
    }));
    
    setAnalyticsData({
      userGrowth,
      postActivity,
      engagementRates,
      topCategories,
      deviceUsage,
      peakHours
    });
  };

  // Initial data load
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  // Render bar chart
  const renderBarChart = (data, labels, title, color = '#1e3c72') => {
    const maxValue = Math.max(...data) * 1.1;
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="bar-chart">
          {data.map((value, index) => (
            <div key={index} className="bar-column">
              <div 
                className="bar" 
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              >
                <span className="bar-value">{value}</span>
              </div>
              <div className="bar-label">{labels[index]}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render line chart
  const renderLineChart = (data, labels, title, color = '#1e3c72') => {
    const maxValue = Math.max(...data) * 1.1;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value / maxValue) * 100);
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="line-chart">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            {data.map((value, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((value / maxValue) * 100);
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill={color}
                />
              );
            })}
          </svg>
          <div className="line-labels">
            {labels.map((label, index) => (
              <div key={index} className="line-label" style={{ left: `${(index / (labels.length - 1)) * 100}%` }}>
                {label}
              </div>
            ))}
          </div>
          <div className="line-values">
            {data.map((value, index) => (
              <div 
                key={index} 
                className="line-value" 
                style={{ 
                  left: `${(index / (data.length - 1)) * 100}%`,
                  top: `${100 - ((value / maxValue) * 100)}%`
                }}
              >
                {value.toFixed(1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render horizontal bar chart
  const renderHorizontalBarChart = (data, title) => {
    const maxValue = Math.max(...data.map(item => item.count));
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="horizontal-bar-chart">
          {data.map((item, index) => (
            <div key={index} className="horizontal-bar-row">
              <div className="horizontal-bar-label">{item.name}</div>
              <div className="horizontal-bar-container">
                <div 
                  className="horizontal-bar" 
                  style={{ 
                    width: `${(item.count / maxValue) * 100}%`,
                    backgroundColor: `hsl(${210 + (index * 30)}, 70%, 60%)`
                  }}
                ></div>
                <span className="horizontal-bar-value">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render donut chart
  const renderDonutChart = (data, title) => {
    let startAngle = 0;
    const total = data.reduce((sum, item) => sum + item.percentage, 0);
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="donut-chart-container">
          <svg viewBox="0 0 100 100" className="donut-chart">
            {data.map((item, index) => {
              const angle = (item.percentage / total) * 360;
              const endAngle = startAngle + angle;
              
              // Calculate SVG arc path
              const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const result = (
                <path 
                  key={index}
                  d={pathData}
                  fill={`hsl(${210 + (index * 50)}, 70%, 60%)`}
                />
              );
              
              startAngle += angle;
              return result;
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          
          <div className="donut-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: `hsl(${210 + (index * 50)}, 70%, 60%)` }}
                ></div>
                <div className="legend-label">{item.name}</div>
                <div className="legend-value">{item.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render heat map
  const renderHeatMap = (data, title) => {
    const maxUsers = Math.max(...data.map(item => item.users));
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="heat-map">
          {data.map((item) => (
            <div 
              key={item.hour} 
              className="heat-map-cell" 
              style={{ 
                backgroundColor: `rgba(30, 60, 114, ${item.users / maxUsers})`,
                color: item.users / maxUsers > 0.5 ? 'white' : '#333'
              }}
            >
              <div className="heat-map-hour">{item.hour}:00</div>
              <div className="heat-map-value">{item.users}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get labels based on time range
  const getLabels = () => {
    switch(timeRange) {
      case 'day':
        return Array.from({length: 24}, (_, i) => `${i}:00`);
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month':
        return Array.from({length: 30}, (_, i) => `${i+1}`);
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  };

  // Generate PDF report
  const generatePdfReport = () => {
    setGeneratingReport(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let yPos = margin;
        
        // Add report header
        doc.setFontSize(20);
        doc.setTextColor(30, 60, 114); // Snapture blue
        doc.text('Snapture Analytics Report', pageWidth / 2, yPos, { align: 'center' });
        yPos += 10;
        
        // Add report metadata
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const now = new Date();
        doc.text(`Generated on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;
        
        // Add time range
        let timeRangeText = '';
        switch(timeRange) {
          case 'day': timeRangeText = 'Last 24 Hours'; break;
          case 'week': timeRangeText = 'Last 7 Days'; break;
          case 'month': timeRangeText = 'Last 30 Days'; break;
          case 'year': timeRangeText = 'Last 12 Months'; break;
          default: timeRangeText = 'Last 7 Days';
        }
        doc.text(`Time Period: ${timeRangeText}`, pageWidth / 2, yPos, { align: 'center' });
        yPos += 15;
        
        // Add report content based on report type
        doc.setFontSize(16);
        doc.setTextColor(30, 60, 114);
        
        const labels = getLabels();
        
        switch(reportType) {
          case 'user-growth':
            doc.text('User Growth Analysis', margin, yPos);
            yPos += 10;
            
            // Add description
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            doc.text('This report shows the pattern of new user registrations over the selected time period.', margin, yPos);
            yPos += 15;
            
            // Create simple table header
            doc.setFillColor(30, 60, 114);
            doc.setDrawColor(30, 60, 114);
            doc.setTextColor(255, 255, 255);
            doc.rect(margin, yPos, 80, 10, 'F');
            doc.text('Date/Time', margin + 5, yPos + 7);
            doc.rect(margin + 80, yPos, 40, 10, 'F');
            doc.text('New Users', margin + 85, yPos + 7);
            yPos += 10;
            
            // Add table rows
            doc.setTextColor(80, 80, 80);
            let rowColor = false;
            
            labels.forEach((label, index) => {
              // Alternate row colors
              if (rowColor) {
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, yPos, 120, 8, 'F');
              }
              rowColor = !rowColor;
              
              doc.text(label, margin + 5, yPos + 6);
              doc.text(analyticsData.userGrowth[index].toString(), margin + 85, yPos + 6);
              yPos += 8;
            });
            
            yPos += 15;
            
            // Add insights
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('Key Insights:', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const totalUsers = analyticsData.userGrowth.reduce((sum, val) => sum + val, 0);
            const avgUsersPerDay = (totalUsers / analyticsData.userGrowth.length).toFixed(1);
            const maxUsers = Math.max(...analyticsData.userGrowth);
            const maxUsersDay = labels[analyticsData.userGrowth.indexOf(maxUsers)];
            
            doc.text(`• Total new users: ${totalUsers}`, margin, yPos);
            yPos += 6;
            doc.text(`• Average new users per day: ${avgUsersPerDay}`, margin, yPos);
            yPos += 6;
            doc.text(`• Peak registration day: ${maxUsersDay} with ${maxUsers} new users`, margin, yPos);
            yPos += 6;
            doc.text(`• Growth trend: ${analyticsData.userGrowth[analyticsData.userGrowth.length - 1] > analyticsData.userGrowth[0] ? 'Increasing' : 'Decreasing'}`, margin, yPos);
            break;
            
          case 'post-activity':
            doc.text('Post Activity Analysis', margin, yPos);
            yPos += 10;
            
            // Add description
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            doc.text('This report shows the pattern of new content creation over the selected time period.', margin, yPos);
            yPos += 15;
            
            // Create simple table header
            doc.setFillColor(30, 60, 114);
            doc.setDrawColor(30, 60, 114);
            doc.setTextColor(255, 255, 255);
            doc.rect(margin, yPos, 80, 10, 'F');
            doc.text('Date/Time', margin + 5, yPos + 7);
            doc.rect(margin + 80, yPos, 40, 10, 'F');
            doc.text('New Posts', margin + 85, yPos + 7);
            yPos += 10;
            
            // Add table rows
            doc.setTextColor(80, 80, 80);
            let rowColorPosts = false;
            
            labels.forEach((label, index) => {
              // Alternate row colors
              if (rowColorPosts) {
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, yPos, 120, 8, 'F');
              }
              rowColorPosts = !rowColorPosts;
              
              doc.text(label, margin + 5, yPos + 6);
              doc.text(analyticsData.postActivity[index].toString(), margin + 85, yPos + 6);
              yPos += 8;
            });
            
            yPos += 15;
            
            // Add insights
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('Key Insights:', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const totalPosts = analyticsData.postActivity.reduce((sum, val) => sum + val, 0);
            const avgPostsPerDay = (totalPosts / analyticsData.postActivity.length).toFixed(1);
            const maxPosts = Math.max(...analyticsData.postActivity);
            const maxPostsDay = labels[analyticsData.postActivity.indexOf(maxPosts)];
            
            doc.text(`• Total new posts: ${totalPosts}`, margin, yPos);
            yPos += 6;
            doc.text(`• Average new posts per day: ${avgPostsPerDay}`, margin, yPos);
            yPos += 6;
            doc.text(`• Most active day: ${maxPostsDay} with ${maxPosts} new posts`, margin, yPos);
            yPos += 6;
            doc.text(`• Activity trend: ${analyticsData.postActivity[analyticsData.postActivity.length - 1] > analyticsData.postActivity[0] ? 'Increasing' : 'Decreasing'}`, margin, yPos);
            break;
            
          case 'engagement':
            doc.text('User Engagement Analysis', margin, yPos);
            yPos += 10;
            
            // Add description
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            doc.text('This report shows user engagement metrics over the selected time period.', margin, yPos);
            yPos += 15;
            
            // Create simple table header
            doc.setFillColor(30, 60, 114);
            doc.setDrawColor(30, 60, 114);
            doc.setTextColor(255, 255, 255);
            doc.rect(margin, yPos, 80, 10, 'F');
            doc.text('Date/Time', margin + 5, yPos + 7);
            doc.rect(margin + 80, yPos, 60, 10, 'F');
            doc.text('Engagement Rate', margin + 85, yPos + 7);
            yPos += 10;
            
            // Add table rows
            doc.setTextColor(80, 80, 80);
            let rowColorEngagement = false;
            
            labels.forEach((label, index) => {
              // Alternate row colors
              if (rowColorEngagement) {
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, yPos, 140, 8, 'F');
              }
              rowColorEngagement = !rowColorEngagement;
              
              doc.text(label, margin + 5, yPos + 6);
              doc.text(`${analyticsData.engagementRates[index].toFixed(1)}%`, margin + 85, yPos + 6);
              yPos += 8;
            });
            
            yPos += 15;
            
            // Add insights
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('Key Insights:', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const avgEngagement = (analyticsData.engagementRates.reduce((sum, val) => sum + val, 0) / analyticsData.engagementRates.length).toFixed(1);
            const maxEngagement = Math.max(...analyticsData.engagementRates).toFixed(1);
            const maxEngagementDay = labels[analyticsData.engagementRates.indexOf(Math.max(...analyticsData.engagementRates))];
            
            doc.text(`• Average engagement rate: ${avgEngagement}%`, margin, yPos);
            yPos += 6;
            doc.text(`• Peak engagement day: ${maxEngagementDay} with ${maxEngagement}% engagement`, margin, yPos);
            yPos += 6;
            doc.text(`• Engagement trend: ${analyticsData.engagementRates[analyticsData.engagementRates.length - 1] > analyticsData.engagementRates[0] ? 'Increasing' : 'Decreasing'}`, margin, yPos);
            break;
            
          case 'comprehensive':
            doc.text('Comprehensive Platform Analysis', margin, yPos);
            yPos += 10;
            
            // Add description
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            doc.text('This report provides a comprehensive overview of platform performance metrics.', margin, yPos);
            yPos += 15;
            
            // User Growth Summary
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('1. User Growth Summary', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const totalUsersComp = analyticsData.userGrowth.reduce((sum, val) => sum + val, 0);
            doc.text(`• Total new users: ${totalUsersComp}`, margin, yPos);
            yPos += 6;
            doc.text(`• Growth trend: ${analyticsData.userGrowth[analyticsData.userGrowth.length - 1] > analyticsData.userGrowth[0] ? 'Positive' : 'Negative'}`, margin, yPos);
            yPos += 12;
            
            // Post Activity Summary
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('2. Content Creation Summary', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const totalPostsComp = analyticsData.postActivity.reduce((sum, val) => sum + val, 0);
            doc.text(`• Total new posts: ${totalPostsComp}`, margin, yPos);
            yPos += 6;
            doc.text(`• Activity trend: ${analyticsData.postActivity[analyticsData.postActivity.length - 1] > analyticsData.postActivity[0] ? 'Increasing' : 'Decreasing'}`, margin, yPos);
            yPos += 12;
            
            // Engagement Summary
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('3. Engagement Summary', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            const avgEngagementComp = (analyticsData.engagementRates.reduce((sum, val) => sum + val, 0) / analyticsData.engagementRates.length).toFixed(1);
            doc.text(`• Average engagement rate: ${avgEngagementComp}%`, margin, yPos);
            yPos += 6;
            doc.text(`• Engagement trend: ${analyticsData.engagementRates[analyticsData.engagementRates.length - 1] > analyticsData.engagementRates[0] ? 'Improving' : 'Declining'}`, margin, yPos);
            yPos += 12;
            
            // Device Usage Summary
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('4. Device Usage Summary', margin, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setTextColor(80, 80, 80);
            analyticsData.deviceUsage.forEach((device, index) => {
              doc.text(`• ${device.name}: ${device.percentage}%`, margin, yPos);
              yPos += 6;
            });
            yPos += 6;
            
            // Add top categories table
            doc.setFontSize(14);
            doc.setTextColor(30, 60, 114);
            doc.text('5. Top Content Categories', margin, yPos);
            yPos += 10;
            
            // Create simple table header for categories
            doc.setFillColor(30, 60, 114);
            doc.setDrawColor(30, 60, 114);
            doc.setTextColor(255, 255, 255);
            doc.rect(margin, yPos, 80, 10, 'F');
            doc.text('Category', margin + 5, yPos + 7);
            doc.rect(margin + 80, yPos, 60, 10, 'F');
            doc.text('Content Count', margin + 85, yPos + 7);
            yPos += 10;
            
            // Add table rows for categories
            doc.setTextColor(80, 80, 80);
            let rowColorCategories = false;
            
            analyticsData.topCategories.forEach((category) => {
              // Alternate row colors
              if (rowColorCategories) {
                doc.setFillColor(240, 240, 240);
                doc.rect(margin, yPos, 140, 8, 'F');
              }
              rowColorCategories = !rowColorCategories;
              
              doc.text(category.name, margin + 5, yPos + 6);
              doc.text(category.count.toString(), margin + 85, yPos + 6);
              yPos += 8;
            });
            break;
            
          default:
            doc.text('User Growth Analysis', margin, yPos);
            // Default to user growth report
            // (same content as user-growth case)
        }
        
        // Add footer
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text(`Snapture Analytics Report - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
        
        // Save the PDF
        doc.save(`snapture-${reportType}-report-${timeRange}.pdf`);
        setGeneratingReport(false);
        setShowReportModal(false);
      } catch (err) {
        console.error('Error generating PDF report:', err);
        setError('Failed to generate report');
        setGeneratingReport(false);
      }
    }, 1000); // Simulate processing time
  };
  
  // Generate CSV report
  const generateCsvReport = () => {
    setGeneratingReport(true);
    
    setTimeout(() => {
      try {
        const labels = getLabels();
        let csvContent = '';
        let fileName = '';
        
        switch(reportType) {
          case 'user-growth':
            csvContent = 'Date/Time,New Users\n';
            fileName = 'snapture-user-growth-report';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.userGrowth[index]}\n`;
            });
            break;
            
          case 'post-activity':
            csvContent = 'Date/Time,New Posts\n';
            fileName = 'snapture-post-activity-report';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.postActivity[index]}\n`;
            });
            break;
            
          case 'engagement':
            csvContent = 'Date/Time,Engagement Rate (%)\n';
            fileName = 'snapture-engagement-report';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.engagementRates[index].toFixed(1)}\n`;
            });
            break;
            
          case 'comprehensive':
            // User growth data
            csvContent = 'USER GROWTH DATA\nDate/Time,New Users\n';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.userGrowth[index]}\n`;
            });
            
            // Post activity data
            csvContent += '\nPOST ACTIVITY DATA\nDate/Time,New Posts\n';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.postActivity[index]}\n`;
            });
            
            // Engagement data
            csvContent += '\nENGAGEMENT DATA\nDate/Time,Engagement Rate (%)\n';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.engagementRates[index].toFixed(1)}\n`;
            });
            
            // Device usage data
            csvContent += '\nDEVICE USAGE DATA\nDevice,Percentage\n';
            
            analyticsData.deviceUsage.forEach(device => {
              csvContent += `${device.name},${device.percentage}\n`;
            });
            
            // Top categories data
            csvContent += '\nTOP CATEGORIES DATA\nCategory,Content Count\n';
            
            analyticsData.topCategories.forEach(category => {
              csvContent += `${category.name},${category.count}\n`;
            });
            
            fileName = 'snapture-comprehensive-report';
            break;
            
          default:
            csvContent = 'Date/Time,New Users\n';
            fileName = 'snapture-user-growth-report';
            
            labels.forEach((label, index) => {
              csvContent += `${label},${analyticsData.userGrowth[index]}\n`;
            });
        }
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}-${timeRange}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setGeneratingReport(false);
        setShowReportModal(false);
      } catch (err) {
        console.error('Error generating CSV report:', err);
        setError('Failed to generate report');
        setGeneratingReport(false);
      }
    }, 1000); // Simulate processing time
  };
  
  // Handle report generation
  const handleGenerateReport = () => {
    if (reportFormat === 'pdf') {
      generatePdfReport();
    } else if (reportFormat === 'csv') {
      generateCsvReport();
    }
  };
  
  // Toggle report modal
  const toggleReportModal = () => {
    setShowReportModal(!showReportModal);
  };

  const labels = getLabels();

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="header-actions">
          <div className="time-range-selector">
            <label htmlFor="time-range">Time Range:</label>
            <select 
              id="time-range" 
              value={timeRange} 
              onChange={handleTimeRangeChange}
              className="time-range-select"
            >
              <option value="day">Last 24 Hours</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
          
          <button className="generate-report-btn" onClick={toggleReportModal}>
            <i className="fas fa-file-download"></i>
            Generate Report
          </button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <div className="loading-indicator">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading analytics data...</span>
        </div>
      ) : (
        <>
          {/* Report Generation Modal */}
          {showReportModal && (
            <div className="modal-overlay">
              <div className="modal-content report-modal">
                <div className="modal-header">
                  <h3>Generate Analytics Report</h3>
                  <button className="close-btn" onClick={toggleReportModal}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="report-type">Report Type:</label>
                    <select 
                      id="report-type" 
                      value={reportType} 
                      onChange={(e) => setReportType(e.target.value)}
                      className="report-select"
                    >
                      <option value="user-growth">User Growth</option>
                      <option value="post-activity">Post Activity</option>
                      <option value="engagement">User Engagement</option>
                      <option value="comprehensive">Comprehensive Report</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="report-format">Format:</label>
                    <div className="format-options">
                      <label className="format-option">
                        <input 
                          type="radio" 
                          name="report-format" 
                          value="pdf" 
                          checked={reportFormat === 'pdf'} 
                          onChange={() => setReportFormat('pdf')}
                        />
                        <span className="format-icon"><i className="fas fa-file-pdf"></i></span>
                        <span className="format-label">PDF</span>
                      </label>
                      
                      <label className="format-option">
                        <input 
                          type="radio" 
                          name="report-format" 
                          value="csv" 
                          checked={reportFormat === 'csv'} 
                          onChange={() => setReportFormat('csv')}
                        />
                        <span className="format-icon"><i className="fas fa-file-csv"></i></span>
                        <span className="format-label">CSV</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="report-preview">
                    <h4>Report Preview</h4>
                    <div className="preview-content">
                      <div className="preview-header">
                        <i className={`fas ${reportFormat === 'pdf' ? 'fa-file-pdf' : 'fa-file-csv'}`}></i>
                        <span>{reportType === 'user-growth' ? 'User Growth Report' : 
                               reportType === 'post-activity' ? 'Post Activity Report' : 
                               reportType === 'engagement' ? 'User Engagement Report' : 
                               'Comprehensive Platform Report'}</span>
                      </div>
                      
                      <div className="preview-details">
                        <p><strong>Time Period:</strong> {timeRange === 'day' ? 'Last 24 Hours' : 
                                                         timeRange === 'week' ? 'Last 7 Days' : 
                                                         timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'}</p>
                        <p><strong>Data Points:</strong> {timeRange === 'day' ? '24' : 
                                                         timeRange === 'week' ? '7' : 
                                                         timeRange === 'month' ? '30' : '12'}</p>
                        <p><strong>Format:</strong> {reportFormat.toUpperCase()}</p>
                        <p><strong>File Name:</strong> snapture-{reportType}-report-{timeRange}.{reportFormat}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={toggleReportModal}>Cancel</button>
                  <button 
                    className="generate-btn" 
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                  >
                    {generatingReport ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Generating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-file-download"></i>
                        Generate & Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="analytics-content">
          <div className="analytics-grid">
            <div className="analytics-card">
              {renderBarChart(analyticsData.userGrowth, labels, 'New User Registrations')}
            </div>
            
            <div className="analytics-card">
              {renderLineChart(analyticsData.postActivity, labels, 'Post Activity')}
            </div>
            
            <div className="analytics-card">
              {renderLineChart(analyticsData.engagementRates, labels, 'Engagement Rate (%)', '#4caf50')}
            </div>
            
            <div className="analytics-card">
              {renderHorizontalBarChart(analyticsData.topCategories, 'Top Categories')}
            </div>
            
            <div className="analytics-card">
              {renderDonutChart(analyticsData.deviceUsage, 'Device Usage')}
            </div>
            
            <div className="analytics-card">
              {renderHeatMap(analyticsData.peakHours, 'Peak Usage Hours')}
            </div>
          </div>
          
          <div className="analytics-insights">
            <h3>Key Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="insight-content">
                  <h4>User Growth</h4>
                  <p>User registrations have {analyticsData.userGrowth[analyticsData.userGrowth.length - 1] > analyticsData.userGrowth[0] ? 'increased' : 'decreased'} by {Math.abs(Math.round(((analyticsData.userGrowth[analyticsData.userGrowth.length - 1] - analyticsData.userGrowth[0]) / analyticsData.userGrowth[0]) * 100))}% compared to the beginning of this period.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon">
                  <i className="fas fa-image"></i>
                </div>
                <div className="insight-content">
                  <h4>Content Creation</h4>
                  <p>The most active day for content creation is {labels[analyticsData.postActivity.indexOf(Math.max(...analyticsData.postActivity))]} with {Math.max(...analyticsData.postActivity)} new posts.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="insight-content">
                  <h4>Engagement</h4>
                  <p>Average engagement rate is {(analyticsData.engagementRates.reduce((a, b) => a + b, 0) / analyticsData.engagementRates.length).toFixed(1)}%, which is {(analyticsData.engagementRates.reduce((a, b) => a + b, 0) / analyticsData.engagementRates.length) > 5 ? 'above' : 'below'} industry average.</p>
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-icon">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="insight-content">
                  <h4>Device Usage</h4>
                  <p>Mobile usage accounts for {analyticsData.deviceUsage.find(d => d.name === 'Mobile').percentage}% of all platform activity, suggesting a need for continued mobile optimization.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
}

export default AdminAnalytics;
