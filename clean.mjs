import fs from 'fs'
import path from 'path'

const clean = async (dir) => {
	const files = await fs.promises.readdir(dir)
	files.forEach(i => {
		fs.unlink(path.join(dir, i), err => console.error)
	})
}

clean('./dist')