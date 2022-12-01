package y2017

import org.junit.Assert.assertEquals
import org.junit.Test
import y2017.day17
import y2017.day17Second

class day17Test {

    @Test
    fun test1() {
        assertEquals(638, day17(3))
    }

    @Test
    fun test1Actual() {
        assertEquals(1306, day17(324))
    }

    @Test
    fun testActualSecond() {
        assertEquals(20430489, day17Second(324))
    }
}