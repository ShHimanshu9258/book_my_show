const {faker} =require('@faker-js/faker');
 
  function createRandomData(){
    return {
        userId: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: 'testing123',
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
        phone:faker.phone.phoneNumber()
      };
}
 module.exports ={ createRandomData };