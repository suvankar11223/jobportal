// Job filtering utility functions

export const locationKeywords = {
    'bangalore': ['bangalore', 'bengaluru', 'blr'],
    'delhi ncr': ['delhi', 'ncr', 'gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad'],
    'hyderabad': ['hyderabad', 'hyd', 'secunderabad'],
    'pune': ['pune', 'puna'],
    'mumbai': ['mumbai', 'bombay', 'bom'],
    'chennai': ['chennai', 'madras'],
    'vellore': ['vellore', 'vit']
};

export const industryKeywords = {
    'frontend developer': ['frontend', 'front-end', 'react', 'vue', 'angular'],
    'backend developer': ['backend', 'back-end', 'node', 'python', 'java', 'api'],
    'fullstack developer': ['fullstack', 'full-stack', 'full stack'],
    'ai/ml engineer': ['ai', 'ml', 'machine learning', 'artificial intelligence', 'data science'],
    'data scientist': ['data scientist', 'data science', 'analytics', 'statistics'],
    'data analyst': ['data analyst', 'business analyst', 'analytics'],
    'devops engineer': ['devops', 'dev ops', 'infrastructure', 'deployment', 'ci/cd'],
    'software engineer': ['software engineer', 'software developer', 'programmer']
};

export const salaryRanges = {
    '0-40k': { min: 0, max: 40000 },
    '42-1lakh': { min: 42000, max: 100000 },
    '1lakh to 5lakh': { min: 100000, max: 500000 },
    '5lakh to 10lakh': { min: 500000, max: 1000000 },
    '10lakh to 20lakh': { min: 1000000, max: 2000000 },
    '20lakh to 50lakh': { min: 2000000, max: 5000000 },
    '50lakh to 1 crore': { min: 5000000, max: 10000000 }
};

// Check if location matches query with enhanced keyword matching
export const matchesLocation = (jobLocation, query) => {
    if (!jobLocation || !query) return false;
    
    const location = jobLocation.toLowerCase();
    const searchQuery = query.toLowerCase();
    
    // Direct match
    if (location.includes(searchQuery)) return true;
    
    // Enhanced location matching using keywords
    const locationEntry = Object.entries(locationKeywords).find(([key]) => 
        key === searchQuery || locationKeywords[key]?.includes(searchQuery)
    );
    
    if (locationEntry) {
        return locationEntry[1].some(keyword => location.includes(keyword));
    }
    
    return false;
};

// Check if job title/industry matches query with enhanced keyword matching
export const matchesIndustry = (jobTitle, jobDescription, query) => {
    if (!query) return false;
    
    const title = (jobTitle || '').toLowerCase();
    const description = (jobDescription || '').toLowerCase();
    const searchQuery = query.toLowerCase();
    
    // Direct match
    if (title.includes(searchQuery) || description.includes(searchQuery)) return true;
    
    // Enhanced industry matching using keywords
    const industryEntry = Object.entries(industryKeywords).find(([key]) => key === searchQuery);
    
    if (industryEntry) {
        return industryEntry[1].some(keyword => 
            title.includes(keyword) || description.includes(keyword)
        );
    }
    
    return false;
};

// Check if salary matches the range
export const matchesSalaryRange = (jobSalary, filterSalary) => {
    if (!jobSalary || !filterSalary) return false;
    
    const range = salaryRanges[filterSalary];
    if (!range) return false;
    
    const salary = parseInt(jobSalary.toString().replace(/[^\d]/g, ''));
    return salary >= range.min && salary <= range.max;
};

// Main filtering function
export const filterJobs = (jobs, searchQuery) => {
    if (!searchQuery || !searchQuery.trim()) return jobs;
    
    return jobs.filter((job) => {
        const query = searchQuery.toLowerCase();
        const company = job.company?.name?.toLowerCase() || '';
        
        // Check for matches across different criteria
        const locationMatch = matchesLocation(job.location, query);
        const industryMatch = matchesIndustry(job.title, job.description, query);
        const salaryMatch = matchesSalaryRange(job.salary, searchQuery);
        const companyMatch = company.includes(query);
        
        return locationMatch || industryMatch || salaryMatch || companyMatch;
    });
};

// Enhanced search with multiple filters
export const advancedFilterJobs = (jobs, filters = {}) => {
    const { location, industry, salaryRange, company, keywords } = filters;
    
    return jobs.filter((job) => {
        // Location filter
        if (location && !matchesLocation(job.location, location)) {
            return false;
        }
        
        // Industry filter  
        if (industry && !matchesIndustry(job.title, job.description, industry)) {
            return false;
        }
        
        // Salary filter
        if (salaryRange && !matchesSalaryRange(job.salary, salaryRange)) {
            return false;
        }
        
        // Company filter
        if (company) {
            const jobCompany = job.company?.name?.toLowerCase() || '';
            if (!jobCompany.includes(company.toLowerCase())) {
                return false;
            }
        }
        
        // Keywords filter
        if (keywords) {
            const title = (job.title || '').toLowerCase();
            const description = (job.description || '').toLowerCase();
            const keywordMatch = keywords.toLowerCase().split(' ').some(keyword => 
                title.includes(keyword) || description.includes(keyword)
            );
            if (!keywordMatch) {
                return false;
            }
        }
        
        return true;
    });
};
