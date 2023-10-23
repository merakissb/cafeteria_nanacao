const request = require('supertest');
const server = require('../index');


// Testea que la ruta GET /cafes devuelve un status code 200 y el tipo de dato recibido es un arreglo
// con por lo menos 1 objeto
describe('GET /cafes', () => {
  describe('When the request is valid', () => {
    it('returns 200 OK', async () => {
      const response = await request(server).get('/cafes').send();

      expect(response.statusCode).toBe(200);
    });

    it('returns a list of cafes', async () => {
      const response = await request(server).get('/cafes').send();

      expect(Array.isArray(response.body)).toBe(true); // Verifica si response.body es un array
      expect(response.body.length).toBeGreaterThan(0); // Verifica si la longitud del array es mayor que 0
    });
  });
});

// Comprueba que se obtiene un código 404 al intentar eliminar un café con un id que no existe
describe('DELETE /cafes/:id', () => {
  describe('When id is invalid', () => {
    it('returns 404', async () => {
      const response = await request(server).delete('/cafes/9999').set('Authorization', 'token').send();

      expect(response.statusCode).toBe(404);
    });

    it('does not modify the array', async () => {
      const response = await request(server).get('/cafes').send();
      const size = response.body.length;

      expect(size).toBe(4);
    });
  });
});

// Prueba que la ruta POST /cafes agrega un nuevo café y devuelve un código 201
describe('POST /cafes', () => {
  describe('When the request is valid', () => {
    it('returns 201 OK', async () => {
      const response = await request(server)
        .post('/cafes')
        .set('Authorization', 'token')
        .send({ id: 5, nombre: 'Chocolatado' });

      expect(response.statusCode).toBe(201);
    });

    it('increases the size by 1', async () => {
      const response = await request(server).get('/cafes').send();
      const size = response.body.length;

      expect(size).toBe(5);
    });
  });
});


// Prueba que la ruta PUT /cafes devuelve un status code 400 si intentas actualizar un
// café enviando un id en los parámetros que sea diferente al id dentro del payload.
describe('PUT /cafes/:id', () => {
  describe('When id in payload is invalid', () => {
    it('returns 400', async () => {
      const response = await request(server).put('/cafes/2').set('Authorization', 'token').send(
        {id: 1, nombre: 'Chocolatado'}
      );

      expect(response.statusCode).toBe(400);
    });
  });
});