/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
 
import { Tasks } from './tasks.js';
import { assert } from 'meteor/practicalmeteor:chai';

if (Meteor.isServer) {
  describe('Tasks', () => {
    describe('methods', () => {
      const userId = Random.id();
      let taskId;
 
      beforeEach(() => {
        Tasks.remove({});
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
          private: true
        });
      });

      it('can delete task when owned', () => {
        // Find the internal implementation of the task method so we can
        // test it in isolation
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
 
        // Set up a fake method invocation that looks like what the method expects
        const wrongId = userId + '_wrong';
        const wrong_invocation = { wrongId };
 
        // Verify initial number of tasks
        assert.equal(Tasks.find().count(), 1);

        // Verify that wrong invocation fails an throws error
        assert.throws(() => deleteTask.apply(wrong_invocation, [taskId]), Meteor.Error, 'not-authorized');

        // Verify that no tasks were deleted
        assert.equal(Tasks.find().count(), 1);

        // Setup invocation that pretends to be logged in as owning user
        const invocation = { userId };
       
        // Run the method with `this` set to the fake invocation
        assert.doesNotThrow(() => deleteTask.apply(invocation, [taskId]));
 
        // Verify that the method does what we expected
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}