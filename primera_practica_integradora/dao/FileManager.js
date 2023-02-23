const fs = require('fs');

class FileManager {

	leerArchivo(path){
		try{
			const data = fs.readFileSync(path, 'utf8')

			if (data.length) {
				return JSON.parse(data);
			}

			return JSON.parse('[]');

		} catch (error) {
			console.log(error);
			return false;
		}

	}

	guardarArchivo(path, data){
		try {
			fs.writeFileSync(path, JSON.stringify(data))
			return true;
		} catch (error) {
  			return false;
  		}
	}

}

module.exports.FileManager = FileManager;