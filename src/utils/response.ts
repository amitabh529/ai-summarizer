import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'

// Base API configuration
const API_BASE_URL = import.meta.env.DEV 
  ? '/api' // Use proxy in development
  : 'https://4qtw866p-5173.inc1.devtunnels.ms/' // Direct URL in production

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    'Accept': '*/*',
  },
  withCredentials: false,
})

// Response interface for file upload
interface FileUploadResponse {
  success: boolean
  message: string
  data?: any
  filename?: string
  processing_time?: number
}

// Error response interface
interface ErrorResponse {
  success: false
  message: string
  error?: string
  details?: any
}

/**
 * Upload file to backend and get document analysis
 * @param file - File to upload
 * @param endpoint - API endpoint (default: '/upload')
 * @returns Promise with file upload response
 */
export const uploadFile = async (
  file: File, 
  endpoint: string = '/summarize' // Try common Flask endpoint
): Promise<FileUploadResponse> => {
  try {
    // ✅ REQUEST DETAILS
    console.log('🚀 UPLOAD REQUEST DETAILS:')
    console.log('==========================')
    console.log('File Name:', file.name)
    console.log('File Size:', file.size, 'bytes')
    console.log('File Type:', file.type)
    console.log('Target URL:', `${API_BASE_URL}${endpoint}`)
    console.log('==========================')

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)

    // Make POST request
    const response: AxiosResponse<any> = await apiClient.post(
      endpoint,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*',
        },
        withCredentials: false,
      }
    )

    // ✅ EXTRACTED RESPONSE DATA
    console.log('📄 EXTRACTED RESPONSE:')
    console.log('======================')
    console.log(JSON.stringify(response.data, null, 2))
    console.log('======================')

    // Handle different response formats and parse JSON
    let parsedData = response.data
    
    // Check if the response data is already in the correct format
    if (response.data?.headings && Array.isArray(response.data.headings)) {
      console.log("✅ API returned data directly in correct format")
      parsedData = response.data
    }
    // Check for Gemini API response format first (candidates structure)
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const textContent = response.data.candidates[0].content.parts[0].text
      console.log("📝 Raw text data:", textContent)
      
      try {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = textContent.match(/```json\n(.*?)\n```/s)
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[1])
          
          // ✅ PARSED JSON DATA
          console.log('📋 PARSED JSON DATA:')
          console.log('====================')
          console.log(JSON.stringify(parsedData, null, 2))
          console.log('====================')
        } else {
          // Try to parse the entire text as JSON if no code blocks found
          parsedData = JSON.parse(textContent)
          console.log('📋 PARSED ENTIRE TEXT AS JSON')
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse JSON from candidates text field:', parseError)
        // Try to fix truncated JSON by attempting to parse what we have
        try {
          const jsonMatch = textContent.match(/```json\n(.*?)(?:\n```|$)/s)
          if (jsonMatch) {
            let jsonStr = jsonMatch[1].trim()
            console.log('🔧 Attempting to fix truncated JSON...')
            
            // Remove any trailing incomplete structures
            if (jsonStr.includes('...') || jsonStr.includes('(output is comming')) {
              // Find the last complete object/array before the truncation
              const lastCompleteMatch = jsonStr.match(/(.*?)(?:\.\.\.|output is comming|$)/s)
              if (lastCompleteMatch) {
                jsonStr = lastCompleteMatch[1].trim()
              }
            }
            
            // Try to balance braces and brackets
            let openBraces = 0
            let openBrackets = 0
            let validJson = ''
            
            for (let i = 0; i < jsonStr.length; i++) {
              const char = jsonStr[i]
              validJson += char
              
              if (char === '{') openBraces++
              else if (char === '}') openBraces--
              else if (char === '[') openBrackets++
              else if (char === ']') openBrackets--
              
              // If we reach a balanced state and find a complete structure, try to parse
              if (openBraces === 0 && openBrackets === 0 && validJson.trim().endsWith('}')) {
                try {
                  parsedData = JSON.parse(validJson)
                  console.log('✅ Successfully fixed truncated JSON')
                  break
                } catch (testError) {
                  // Continue building the string
                }
              }
            }
            
            // If still not parsed, try adding missing closing braces
            if (!parsedData || typeof parsedData !== 'object') {
              while (openBraces > 0) {
                validJson += '}'
                openBraces--
              }
              while (openBrackets > 0) {
                validJson += ']'
                openBrackets--
              }
              
              parsedData = JSON.parse(validJson)
              console.log('✅ Fixed JSON by adding missing closing braces')
            }
          }
        } catch (fixError) {
          console.error('❌ Could not fix truncated JSON:', fixError)
          console.log('📄 Raw problematic JSON:', textContent.substring(0, 500) + '...')
          
          // As a last resort, try to extract at least the visible headings from the text
          try {
            const headingMatches = textContent.match(/"title":\s*"([^"]+)"/g)
            if (headingMatches) {
              console.log('🔧 Creating minimal response from extracted titles...')
              const extractedTitles = headingMatches.map((match: string) => {
                const titleMatch = match.match(/"title":\s*"([^"]+)"/)
                return titleMatch ? titleMatch[1] : 'Extracted Title'
              })
              
              parsedData = {
                headings: extractedTitles.slice(0, 5).map((title: string, index: number) => ({
                  title,
                  content: 'Content extracted from truncated response',
                  start_page: 1,
                  start_line: index + 1,
                  end_page: 1,
                  end_line: index + 2,
                  subheadings: []
                })),
                summary: 'Document analysis was partially successful but response was truncated',
                keywords: ['extracted', 'partial', 'data']
              }
              console.log('✅ Created fallback response from extracted data')
            }
          } catch (extractError) {
            console.error('❌ Could not extract titles either:', extractError)
          }
        }
      }
    }
    // Check for direct text field (fallback)
    else if (response.data && response.data.text) {
      try {
        const jsonMatch = response.data.text.match(/```json\n(.*?)\n```/s)
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[1])
          
          // ✅ PARSED JSON DATA
          console.log('📋 PARSED JSON DATA:')
          console.log('====================')
          console.log(JSON.stringify(parsedData, null, 2))
          console.log('====================')
        }
      } catch (parseError) {
        console.warn('⚠️ Could not parse JSON from text field:', parseError)
      }
    }
    // Check if response.data is already a valid document structure
    else if (response.data && typeof response.data === 'object') {
      // Response might be the document data directly
      if (response.data.headings || response.data.summary || response.data.keywords) {
        console.log("✅ Response data appears to be document structure directly")
        parsedData = response.data
      }
    }

    // Transform the data to match our expected format
    const transformedData: FileUploadResponse = {
      success: true,
      message: 'File uploaded and processed successfully',
      data: parsedData, // This will now be the pure JSON data without wrapper
      filename: file.name,
      processing_time: Date.now()
    }

    // Handle case where API returns data directly without wrapper
    if (parsedData && parsedData.headings && Array.isArray(parsedData.headings)) {
      // API returned the document data directly
      console.log('🎯 API returned document data directly')
      transformedData.data = parsedData
      transformedData.success = true
      transformedData.message = 'Document processed successfully'
    }
    // Handle case where API returns wrapped response
    else if (response.data.success !== undefined) {
      // API returned wrapped response
      transformedData.success = response.data.success
      transformedData.message = response.data.message || 'File processed'
      transformedData.data = response.data.data || parsedData
    }

    // ✅ FINAL CLEAN JSON RESPONSE
    console.log('🎯 FINAL CLEAN RESPONSE:')
    console.log('========================')
    console.log(JSON.stringify(transformedData, null, 2))
    console.log('========================')

    return transformedData

  } catch (error) {
    console.error('❌ File upload failed:', error)

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>
      
      // ❌ DETAILED ERROR LOGGING
      console.log('🔍 BACKEND ERROR DETAILS:')
      console.log('=========================')
      console.log('Status:', axiosError.response?.status)
      console.log('Status Text:', axiosError.response?.statusText)
      console.log('Response Data:', JSON.stringify(axiosError.response?.data, null, 2))
      console.log('Request URL:', axiosError.config?.url)
      console.log('Request Method:', axiosError.config?.method)
      console.log('Error Code:', axiosError.code)
      console.log('Error Message:', axiosError.message)
      console.log('=========================')
      
      // Return structured error response
      throw {
        success: false,
        message: axiosError.response?.data?.message || axiosError.message || 'Upload failed',
        error: axiosError.response?.data?.error || 'Network error',
        isCorsError: axiosError.code === 'ERR_NETWORK' || axiosError.message.includes('CORS'),
        details: {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          code: axiosError.code
        }
      } as ErrorResponse & { isCorsError: boolean }
    }

    // Handle non-axios errors
    throw {
      success: false,
      message: 'Unknown error occurred during upload',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    } as ErrorResponse
  }
}

/**
 * Parse Gemini API response format to extract document data
 * @param apiResponse - The Gemini API response object with candidates array
 * @returns Parsed document data or null if parsing fails
 */
export const parseGeminiResponse = (apiResponse: any) => {
  try {
    // Extract the text content from the candidates
    const textContent = apiResponse.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!textContent) {
      console.warn('⚠️ No text content found in Gemini response')
      return null
    }
    
    // Extract JSON from the markdown code block
    const jsonMatch = textContent.match(/```json\n(.*?)\n```/s)
    
    if (!jsonMatch) {
      console.warn('⚠️ No JSON code block found in Gemini response')
      return null
    }
    
    // Parse the extracted JSON
    const documentData = JSON.parse(jsonMatch[1])
    
    // ✅ PARSED GEMINI RESPONSE DATA
    console.log('📋 PARSED GEMINI JSON:')
    console.log('======================')
    console.log(JSON.stringify(documentData, null, 2))
    console.log('======================')
    
    return documentData
    
  } catch (error) {
    console.error('❌ Failed to parse Gemini response:', error)
    return null
  }
}

/**
 * Alternative upload method with fetch API
 */
export const uploadFileWithFetch = async (
  file: File,
  endpoint: string = '/summarize'
): Promise<FileUploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filename', file.name)
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      mode: 'cors',
      credentials: 'omit',
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // ✅ EXTRACTED FETCH RESPONSE DATA
    console.log('📄 FETCH EXTRACTED RESPONSE:')
    console.log('============================')
    console.log(JSON.stringify(data, null, 2))
    console.log('============================')
    
    return data
    
  } catch (error) {
    console.error('❌ Fetch upload failed:', error)
    throw error
  }
}

/**
 * Try upload with both axios and fetch (fallback)
 */
export const uploadFileWithFallback = async (
  file: File,
  endpoint: string = '/summarize'
): Promise<FileUploadResponse> => {
  // List of possible endpoints to try
  const possibleEndpoints = [
    endpoint,
    '/summarize',
    '/upload',
    '/api/upload',
    '/api/summarize',
    '/process',
    '/analyze'
  ];

  let lastError: any = null;

  // Try each endpoint until one works
  for (const tryEndpoint of possibleEndpoints) {
    try {
      console.log(`🔄 Trying endpoint: ${tryEndpoint}`);
      return await uploadFile(file, tryEndpoint);
    } catch (error) {
      console.warn(`❌ Endpoint ${tryEndpoint} failed:`, error);
      lastError = error;
      
      // If it's a 404, try the next endpoint
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        continue;
      }
      
      // If it's not a 404, try fetch method as backup
      try {
        console.log(`🔄 Trying fetch method for endpoint: ${tryEndpoint}`);
        return await uploadFileWithFetch(file, tryEndpoint);
      } catch (fetchError) {
        console.warn(`❌ Fetch method also failed for ${tryEndpoint}:`, fetchError);
        lastError = fetchError;
        continue;
      }
    }
  }

  // If all endpoints failed, throw the last error
  console.error('❌ All endpoints failed. Last error:', lastError);
  throw lastError || new Error('All upload methods failed');
};

/**
 * Discover available API endpoints
 */
export const discoverEndpoints = async (): Promise<string[]> => {
  const testEndpoints = [
    '/health',
    '/status', 
    '/api/health',
    '/api/status',
    '/upload',
    '/summarize',
    '/api/upload',
    '/api/summarize',
    '/process',
    '/analyze'
  ];

  const availableEndpoints: string[] = [];

  for (const endpoint of testEndpoints) {
    try {
      console.log(`🔍 Testing endpoint: ${endpoint}`);
      const response = await apiClient.get(endpoint);
      if (response.status === 200) {
        availableEndpoints.push(endpoint);
        console.log(`✅ Endpoint ${endpoint} is available`);
      }
    } catch (error) {
      console.log(`❌ Endpoint ${endpoint} is not available`);
    }
  }

  console.log('📋 Available endpoints:', availableEndpoints);
  return availableEndpoints;
};

/**
 * Test API connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing API connection...')
    console.log('Target URL:', `${API_BASE_URL}/health`)
    
    const response = await apiClient.get('/health')
    
    console.log('✅ API CONNECTION SUCCESSFUL:')
    console.log('=============================')
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(response.data, null, 2))
    console.log('=============================')
    
    return true
  } catch (error) {
    console.error('❌ API CONNECTION FAILED:')
    console.error('=========================')
    
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status)
      console.error('Response Data:', JSON.stringify(error.response?.data, null, 2))
      console.error('Error Message:', error.message)
    } else {
      console.error('Error:', error)
    }
    console.error('=========================')
    
    return false
  }
}

// Export the configured axios instance
export { apiClient }

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testAPI = {
    discoverEndpoints,
    testConnection,
    uploadFileWithFallback
  };
}
