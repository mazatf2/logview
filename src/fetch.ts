import Queue from 'smart-request-balancer'
import {logstfJson, searchLogListOpts} from './logstf_api'
import JSZip from 'jszip'

const queue = new Queue({
	rules: {
		common: {
			rate: 5,
			limit: 1,
			priority: 1,
		},
	},
	retryTime: 300,
})

export const CacheableFetch = async (request: Request) => {
	
	const cache = await caches.open('cacheable-fetch')
	
	const cachedResult = await cache.match(request)
	if (cachedResult) {
		console.log('cached', cachedResult)
		return cachedResult
	}
	
	const _get = async () => {
		await cache.add(request) // returns undefined if successfully added
		return await cache.match(request)
	}
	
	const get = () => {
		return new Promise((resolve, reject) => {
			queue.request(() => _get())
				.then(i => resolve(i))
				.catch(err => {
					console.log('queue.request', err)
					debugger
					
					reject(err)
				})
		})
	}
	const result = await get()
	return result
}

export const fetchLogList = async (query: Partial<searchLogListOpts>) => {
	
	function validateKeys(q: Partial<searchLogListOpts>): searchLogListOpts {
		return {
			title: q.title || '',
			map: q.map || '',
			uploader: q.uploader || '',
			player: q.player || [],
			limit: q.limit || 10000,
			offset: q.offset || 0,
		}
	}
	
	query = validateKeys(query)
	const params = new URLSearchParams()
	
	for (const [key, value] of Object.entries(query)) {
		if (value)
			params.set(key, value.toString())
	}
	
	
	// http://logs.tf/api/v1/log?title=X&uploader=Y&player=Z&limit=N&offset=N
	const url = `https://logs.tf/api/v1/log?${params.toString()}`
	const req = new Request(url)
	
	return await CacheableFetch(req)
}

export const fetchLogData = async (id: number) => {
	const url = `http://logs.tf/api/v1/log/${id}`
	const req = new Request(url)
	const data = await CacheableFetch(req)
	return data.json() as logstfJson
}

export const fetchLogZip = async (id: string) => {
	const url = `http://logs.tf/logs/log_${id}.log.zip`
	const req = new Request(url)
	const response = await CacheableFetch(req)
	const jsZip = new JSZip()
	const buffer = response.arrayBuffer()
	
	const zip = await JSZip.loadAsync(buffer)
	const file = await zip.file(`log_${id}.log`).async('string')
	
	return file
}